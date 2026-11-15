"""Domain engines: CPU scheduler, arithmetic expression compiler, and 0-1 optimizer."""

from __future__ import annotations

import time
from collections import deque
from collections.abc import Mapping, Sequence

from .contracts import (
    AllocationResult,
    MetricsSink,
    ProcessSpec,
    ResourceItem,
    ScheduleSlice,
    ScheduleSummary,
    SimulationRepository,
    Token,
    ValidationError,
)
from .telemetry import InMemoryMetricsSink


class CpuSchedulerEngine:
    """Deterministic FCFS, non-preemptive SJF, and Round-Robin scheduler."""

    def __init__(
        self,
        repository: SimulationRepository | None = None,
        metrics: MetricsSink | None = None,
    ) -> None:
        self._repo = repository
        self._metrics = metrics or InMemoryMetricsSink()

    def schedule(
        self,
        processes: Sequence[ProcessSpec],
        policy: str = "RR",
        quantum: int = 2,
        run_id: str | None = None,
    ) -> ScheduleSummary:
        started = time.perf_counter()
        if not processes:
            raise ValidationError("processes cannot be empty")
        seen_pids: set[str] = set()
        for proc in processes:
            if not proc.pid.strip():
                raise ValidationError("pid must be non-empty")
            if proc.pid in seen_pids:
                raise ValidationError(f"Duplicate pid: {proc.pid}")
            seen_pids.add(proc.pid)
            if proc.arrival_time < 0 or proc.burst_time <= 0:
                raise ValidationError(f"Invalid timing for process {proc.pid}")

        normalized = policy.upper()
        if normalized == "FCFS":
            slices, completion = self._run_fcfs(processes)
        elif normalized == "SJF":
            slices, completion = self._run_sjf(processes)
        elif normalized == "RR":
            if not isinstance(quantum, int) or isinstance(quantum, bool) or quantum <= 0:
                raise ValidationError("quantum must be a positive integer")
            slices, completion = self._run_rr(processes, quantum)
        else:
            raise ValidationError(f"Unsupported scheduling policy: {policy}")

        total_busy = sum(proc.burst_time for proc in processes)
        makespan = max(completion.values()) - min(p.arrival_time for p in processes)
        waiting_times = [
            completion[p.pid] - p.arrival_time - p.burst_time for p in processes
        ]
        turnaround_times = [completion[p.pid] - p.arrival_time for p in processes]
        utilization = (total_busy / makespan * 100.0) if makespan > 0 else 100.0

        summary = ScheduleSummary(
            policy=normalized,
            slices=tuple(slices),
            avg_waiting_time=sum(waiting_times) / len(waiting_times),
            avg_turnaround_time=sum(turnaround_times) / len(turnaround_times),
            cpu_utilization=utilization,
        )
        if self._repo is not None and run_id:
            self._repo.save_run(run_id, summary)

        elapsed_ms = (time.perf_counter() - started) * 1000.0
        self._metrics.increment("scheduler.runs", policy=normalized)
        self._metrics.observe_ms("scheduler.run_ms", elapsed_ms, policy=normalized)
        return summary

    @staticmethod
    def _run_fcfs(processes: Sequence[ProcessSpec]) -> tuple[list[ScheduleSlice], dict[str, int]]:
        ordered = sorted(processes, key=lambda p: (p.arrival_time, p.pid))
        clock = 0
        slices: list[ScheduleSlice] = []
        completion: dict[str, int] = {}
        for proc in ordered:
            start = max(clock, proc.arrival_time)
            end = start + proc.burst_time
            slices.append(ScheduleSlice(proc.pid, start, end))
            completion[proc.pid] = end
            clock = end
        return slices, completion

    @staticmethod
    def _run_sjf(processes: Sequence[ProcessSpec]) -> tuple[list[ScheduleSlice], dict[str, int]]:
        pending = sorted(processes, key=lambda p: (p.arrival_time, p.burst_time, p.pid))
        clock = 0
        slices: list[ScheduleSlice] = []
        completion: dict[str, int] = {}
        while pending:
            ready = [p for p in pending if p.arrival_time <= clock]
            if not ready:
                clock = pending[0].arrival_time
                ready = [p for p in pending if p.arrival_time <= clock]
            chosen = min(ready, key=lambda p: (p.burst_time, p.arrival_time, p.pid))
            pending.remove(chosen)
            end = clock + chosen.burst_time
            slices.append(ScheduleSlice(chosen.pid, clock, end))
            completion[chosen.pid] = end
            clock = end
        return slices, completion

    @staticmethod
    def _run_rr(
        processes: Sequence[ProcessSpec], quantum: int
    ) -> tuple[list[ScheduleSlice], dict[str, int]]:
        ordered = sorted(processes, key=lambda p: (p.arrival_time, p.pid))
        remaining = {p.pid: p.burst_time for p in ordered}
        completion: dict[str, int] = {}
        slices: list[ScheduleSlice] = []
        ready: deque[ProcessSpec] = deque()
        idx = 0
        clock = ordered[0].arrival_time

        while idx < len(ordered) or ready:
            while idx < len(ordered) and ordered[idx].arrival_time <= clock:
                ready.append(ordered[idx])
                idx += 1
            if not ready:
                clock = ordered[idx].arrival_time
                continue
            proc = ready.popleft()
            run_for = min(quantum, remaining[proc.pid])
            start = clock
            end = start + run_for
            slices.append(ScheduleSlice(proc.pid, start, end))
            remaining[proc.pid] -= run_for
            clock = end
            while idx < len(ordered) and ordered[idx].arrival_time <= clock:
                ready.append(ordered[idx])
                idx += 1
            if remaining[proc.pid] > 0:
                ready.append(proc)
            else:
                completion[proc.pid] = clock
        return slices, completion


class ExpressionLexerParser:
    """Deterministic tokenizer and recursive-descent arithmetic parser."""

    def __init__(self, metrics: MetricsSink | None = None) -> None:
        self._metrics = metrics or InMemoryMetricsSink()

    def tokenize(self, source: str) -> list[Token]:
        if not isinstance(source, str):
            raise TypeError("source must be a string")
        tokens: list[Token] = []
        i = 0
        n = len(source)
        while i < n:
            ch = source[i]
            if ch.isspace():
                i += 1
                continue
            if ch.isdigit() or ch == ".":
                start = i
                dots = 0
                while i < n and (source[i].isdigit() or source[i] == "."):
                    if source[i] == ".":
                        dots += 1
                    i += 1
                if dots > 1 or source[start:i] == ".":
                    raise ValidationError(f"Malformed numeric literal at position {start}")
                tokens.append(Token("NUMBER", source[start:i], start))
                continue
            if ch.isalpha() or ch == "_":
                start = i
                while i < n and (source[i].isalnum() or source[i] == "_"):
                    i += 1
                tokens.append(Token("IDENT", source[start:i], start))
                continue
            if ch in "+-*/^()":
                tokens.append(Token("OP" if ch not in "()" else ch, ch, i))
                i += 1
                continue
            raise ValidationError(f"Unexpected character {ch!r} at position {i}")
        tokens.append(Token("EOF", "", n))
        return tokens

    def evaluate(self, source: str, env: Mapping[str, float] | None = None) -> float:
        started = time.perf_counter()
        tokens = self.tokenize(source)
        scope = env or {}
        pos = 0

        def peek() -> Token:
            return tokens[pos]

        def consume() -> Token:
            nonlocal pos
            tok = tokens[pos]
            pos += 1
            return tok

        def parse_expr() -> float:
            val = parse_term()
            while peek().lexeme in ("+", "-"):
                op = consume().lexeme
                rhs = parse_term()
                val = val + rhs if op == "+" else val - rhs
            return val

        def parse_term() -> float:
            val = parse_power()
            while peek().lexeme in ("*", "/"):
                op = consume().lexeme
                rhs = parse_power()
                if op == "/":
                    if rhs == 0:
                        raise ValidationError("Division by zero")
                    val /= rhs
                else:
                    val *= rhs
            return val

        def parse_power() -> float:
            base = parse_unary()
            if peek().lexeme == "^":
                consume()
                exp = parse_power()
                return base**exp
            return base

        def parse_unary() -> float:
            if peek().lexeme == "-":
                consume()
                return -parse_unary()
            if peek().lexeme == "+":
                consume()
                return parse_unary()
            return parse_primary()

        def parse_primary() -> float:
            tok = peek()
            if tok.kind == "NUMBER":
                consume()
                return float(tok.lexeme)
            if tok.kind == "IDENT":
                consume()
                if tok.lexeme not in scope:
                    raise ValidationError(f"Undefined identifier: {tok.lexeme}")
                return float(scope[tok.lexeme])
            if tok.kind == "(":
                consume()
                inner = parse_expr()
                if peek().kind != ")":
                    raise ValidationError(f"Expected ')' at position {peek().position}")
                consume()
                return inner
            raise ValidationError(f"Unexpected token {tok.lexeme!r} at position {tok.position}")

        result = parse_expr()
        if peek().kind != "EOF":
            raise ValidationError(
                f"Trailing token {peek().lexeme!r} at position {peek().position}"
            )
        elapsed_ms = (time.perf_counter() - started) * 1000.0
        self._metrics.increment("compiler.eval_count")
        self._metrics.observe_ms("compiler.eval_ms", elapsed_ms)
        return result


class ResourceOptimizer:
    """Exact dynamic programming solver for 0-1 bounded capacity allocation."""

    def __init__(self, metrics: MetricsSink | None = None) -> None:
        self._metrics = metrics or InMemoryMetricsSink()

    def optimize_knapsack(
        self, items: Sequence[ResourceItem], capacity: int
    ) -> AllocationResult:
        started = time.perf_counter()
        if not isinstance(capacity, int) or isinstance(capacity, bool) or capacity < 0:
            raise ValidationError("capacity must be a non-negative integer")
        for item in items:
            if item.weight < 0 or item.value < 0:
                raise ValidationError(f"Negative weight/value on item {item.item_id}")

        n = len(items)
        dp = [[0] * (capacity + 1) for _ in range(n + 1)]
        for i, item in enumerate(items, start=1):
            for w in range(capacity + 1):
                dp[i][w] = dp[i - 1][w]
                if item.weight <= w:
                    cand = dp[i - 1][w - item.weight] + item.value
                    dp[i][w] = max(dp[i][w], cand)

        chosen: list[str] = []
        w = capacity
        total_weight = 0
        for i in range(n, 0, -1):
            if dp[i][w] != dp[i - 1][w]:
                item = items[i - 1]
                chosen.append(item.item_id)
                w -= item.weight
                total_weight += item.weight
        chosen.reverse()

        elapsed_ms = (time.perf_counter() - started) * 1000.0
        self._metrics.increment("optimizer.runs")
        self._metrics.observe_ms("optimizer.run_ms", elapsed_ms)
        return AllocationResult(
            capacity=capacity,
            total_weight=total_weight,
            total_value=dp[n][capacity],
            selected_ids=tuple(chosen),
        )
