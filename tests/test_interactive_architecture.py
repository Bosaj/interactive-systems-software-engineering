"""Unit, edge-case, observability, and load tests for interactive_sys."""

from __future__ import annotations

from pathlib import Path
import sys
import unittest

SRC_DIR = str(Path(__file__).resolve().parents[1] / "src")
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

from interactive_sys import (  # noqa: E402
    CpuSchedulerEngine,
    ExpressionLexerParser,
    InMemoryMetricsSink,
    ProcessSpec,
    ResourceItem,
    ResourceOptimizer,
    ServiceContainer,
    ValidationError,
)
from interactive_sys.contracts import InMemorySimulationRepository  # noqa: E402


def _build_container() -> ServiceContainer:
    container = ServiceContainer()
    container.register_singleton(InMemoryMetricsSink, lambda _: InMemoryMetricsSink())
    container.register_singleton(
        InMemorySimulationRepository, lambda _: InMemorySimulationRepository()
    )
    container.register_singleton(
        CpuSchedulerEngine,
        lambda c: CpuSchedulerEngine(
            repository=c.resolve(InMemorySimulationRepository),
            metrics=c.resolve(InMemoryMetricsSink),
        ),
    )
    container.register_singleton(
        ExpressionLexerParser,
        lambda c: ExpressionLexerParser(metrics=c.resolve(InMemoryMetricsSink)),
    )
    container.register_singleton(
        ResourceOptimizer,
        lambda c: ResourceOptimizer(metrics=c.resolve(InMemoryMetricsSink)),
    )
    return container


class TestInteractiveArchitecture(unittest.TestCase):
    def test_cpu_scheduler_fcfs_sjf_and_rr(self) -> None:
        container = _build_container()
        scheduler: CpuSchedulerEngine = container.resolve(CpuSchedulerEngine)
        repo: InMemorySimulationRepository = container.resolve(InMemorySimulationRepository)

        workload = [
            ProcessSpec("P1", arrival_time=0, burst_time=7),
            ProcessSpec("P2", arrival_time=1, burst_time=6),
            ProcessSpec("P3", arrival_time=2, burst_time=2),
        ]
        fcfs = scheduler.schedule(workload, policy="FCFS")
        sjf = scheduler.schedule(workload, policy="SJF")
        rr = scheduler.schedule(workload, policy="RR", quantum=2, run_id="rr-bench")

        self.assertLess(sjf.avg_waiting_time, fcfs.avg_waiting_time)
        self.assertGreater(len(rr.slices), 3)
        self.assertAlmostEqual(rr.cpu_utilization, 100.0)
        self.assertIsNotNone(repo.get_run("rr-bench"))

        with self.assertRaises(ValidationError):
            scheduler.schedule([], policy="RR")
        with self.assertRaises(ValidationError):
            scheduler.schedule(workload, policy="RR", quantum=0)

    def test_expression_lexer_parser_precedence_and_errors(self) -> None:
        container = _build_container()
        parser: ExpressionLexerParser = container.resolve(ExpressionLexerParser)

        val = parser.evaluate("2 ^ 3 ^ 2 - (alpha * 4) + -1", env={"alpha": 3.0})
        self.assertAlmostEqual(val, 499.0)

        with self.assertRaises(ValidationError):
            parser.evaluate("10 / (2 - 2)")
        with self.assertRaises(ValidationError):
            parser.evaluate("10 + unknown_var")
        with self.assertRaises(ValidationError):
            parser.evaluate("(1 + 2")

    def test_knapsack_optimizer_and_stress_observability(self) -> None:
        container = _build_container()
        optimizer: ResourceOptimizer = container.resolve(ResourceOptimizer)
        parser: ExpressionLexerParser = container.resolve(ExpressionLexerParser)
        metrics: InMemoryMetricsSink = container.resolve(InMemoryMetricsSink)

        items = [
            ResourceItem("task-a", weight=3, value=4),
            ResourceItem("task-b", weight=4, value=5),
            ResourceItem("task-c", weight=2, value=3),
        ]
        alloc = optimizer.optimize_knapsack(items, capacity=5)
        self.assertEqual(alloc.total_value, 7)
        self.assertEqual(alloc.total_weight, 5)
        self.assertEqual(alloc.selected_ids, ("task-a", "task-c"))

        for idx in range(250):
            self.assertEqual(parser.evaluate(f"{idx} * 2 + 1"), float(idx * 2 + 1))

        self.assertEqual(metrics.counters["compiler.eval_count"], 250)
        self.assertLess(metrics.percentile_ms("compiler.eval_ms", 95), 50.0)


if __name__ == "__main__":
    unittest.main()
