"""Modular domain architecture for OS scheduling, compilation, and optimization."""

from .contracts import (
    AllocationResult,
    DomainError,
    ProcessSpec,
    ResourceItem,
    ScheduleSlice,
    ScheduleSummary,
    ServiceContainer,
    Token,
    ValidationError,
)
from .engines import (
    CpuSchedulerEngine,
    ExpressionLexerParser,
    ResourceOptimizer,
)
from .telemetry import InMemoryMetricsSink

__all__ = [
    "AllocationResult",
    "CpuSchedulerEngine",
    "DomainError",
    "ExpressionLexerParser",
    "InMemoryMetricsSink",
    "ProcessSpec",
    "ResourceItem",
    "ResourceOptimizer",
    "ScheduleSlice",
    "ScheduleSummary",
    "ServiceContainer",
    "Token",
    "ValidationError",
]
