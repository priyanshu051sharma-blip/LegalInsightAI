import json
from typing import Any, Dict, List, Optional
import re


def extract_json_from_text(text: str) -> Optional[Dict[str, Any]]:
    """Extract JSON from markdown code blocks or plain JSON"""
    try:
        # Try to find JSON in code blocks
        json_match = re.search(r'```(?:json)?\s*(\{[\s\S]*?\})\s*```', text)
        if json_match:
            json_str = json_match.group(1)
        else:
            # Try to find plain JSON
            json_match = re.search(r'(\{[\s\S]*\})', text)
            if json_match:
                json_str = json_match.group(1)
            else:
                return None
        
        return json.loads(json_str)
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return None


def format_response_for_display(data: Any) -> str:
    """Format response data for display"""
    if isinstance(data, dict):
        return json.dumps(data, indent=2)
    elif isinstance(data, list):
        return json.dumps(data, indent=2)
    else:
        return str(data)


def clean_text(text: str) -> str:
    """Clean and normalize text"""
    # Remove extra whitespace
    text = " ".join(text.split())
    # Remove special characters that might cause issues
    text = text.replace("\x00", "")
    return text.strip()


def truncate_text(text: str, max_length: int = 1000) -> str:
    """Truncate text to max length"""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."


def extract_text_from_lines(lines: List[str]) -> str:
    """Join lines of text"""
    return "\n".join(line.strip() for line in lines if line.strip())
