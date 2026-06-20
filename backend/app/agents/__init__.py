"""Agents package"""
from .document_analyzer import get_document_analyzer
from .case_researcher import get_case_researcher
from .risk_detector import get_risk_detector
from .compliance_checker import get_compliance_checker
from .workflow import get_workflow

__all__ = [
    "get_document_analyzer",
    "get_case_researcher",
    "get_risk_detector",
    "get_compliance_checker",
    "get_workflow",
]
