"""Typed DTOs, protocols, errors, and dependency injection container."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field
from typing import Any, Protocol


class DomainError(Exception):
    """Base domain exception."""


class ValidationError(DomainError):
    """Raised when simulation or parsing inputs violate domain invariants."""


@dataclass(frozen=True, slots=True)
class ProcessSpec:
    """Process workload specification for CPU scheduling."""

    pid: str
    arrival_time: int
    burst_time: int


@dataclass(frozen=True, slots=True)
class ScheduleSlice:
    """Single contiguous execution interval on the CPU."""

    pid: str
    start_time: int
    end_time: int


@dataclass(frozen=True, slots=True)
class ScheduleSummary:
    """Computed scheduling metrics across all completed processes."""

    policy: str
    slices: tuple[ScheduleSlice, ...]
    avg_waiting_time: float
    avg_turnaround_time: float
    cpu_utilization: float


@dataclass(frozen=True, slots=True)
class Token:
    """Lexical token produced by expression tokenization."""

    kind: str
    lexeme: str
    position: int


@dataclass(frozen=True, slots=True)
class ResourceItem:
    """0-1 knapsack / operations research item."""

    item_id: str
    weight: int
    value: int


@dataclass(frozen=True, slots=True)
class AllocationResult:
    """Optimal resource allocation result."""

    capacity: int
    total_weight: int
    total_value: int
    selected_ids: tuple[str, ...]


class MetricsSink(Protocol):
    """Observability contract for counters and timings."""

    def increment(self, metric: str, value: int = 1, **tags: str) -> None: ...

    def observe_ms(self, metric: str, duration_ms: float, **tags: str) -> None: ...


class SimulationRepository(Protocol):
    """Persistence contract for recorded scheduling runs."""

    def save_run(self, run_id: str, summary: ScheduleSummary) -> None: ...

    def get_run(self, run_id: str) -> ScheduleSummary | None: ...


@dataclass
class InMemorySimulationRepository:
    """In-memory run archive for tests and verification."""

    _runs: dict[str, ScheduleSummary] = field(default_factory=dict)

    def save_run(self, run_id: str, summary: ScheduleSummary) -> None:
        self._runs[run_id] = summary

    def get_run(self, run_id: str) -> ScheduleSummary | None:
        return self._runs.get(run_id)


class ServiceContainer:
    """Singleton dependency injection container."""

    def __init__(self) -> None:
        self._factories: dict[type[Any], Callable[[ServiceContainer], Any]] = {}
        self._singletons: dict[type[Any], Any] = {}

    def register_singleton(
        self, interface: type[Any], factory: Callable[[ServiceContainer], Any]
    ) -> None:
        self._factories[interface] = factory
        self._singletons.pop(interface, None)

    def resolve(self, interface: type[Any]) -> Any:
        if interface in self._singletons:
            return self._singletons[interface]
        factory = self._factories.get(interface)
        if factory is None:
            raise KeyError(f"No provider registered for {interface.__name__}")
        instance = factory(self)
        self._singletons[interface] = instance
        return instance
