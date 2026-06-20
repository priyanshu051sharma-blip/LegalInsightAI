import os
import mimetypes
from pathlib import Path
from typing import Optional
from app.config import settings


def ensure_upload_directory():
    """Create upload directory if it doesn't exist"""
    Path(settings.UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)


def get_file_extension(filename: str) -> str:
    """Get file extension"""
    return Path(filename).suffix.lower().lstrip(".")


def is_allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    ext = get_file_extension(filename)
    return ext in settings.ALLOWED_EXTENSIONS


def get_file_size(file_path: str) -> int:
    """Get file size in bytes"""
    return os.path.getsize(file_path)


def generate_file_path(user_id: str, filename: str) -> str:
    """Generate safe file path for uploaded file"""
    user_dir = os.path.join(settings.UPLOAD_DIRECTORY, str(user_id))
    Path(user_dir).mkdir(parents=True, exist_ok=True)
    
    # Create unique filename
    ext = get_file_extension(filename)
    unique_filename = f"{user_id}_{filename}"
    
    return os.path.join(user_dir, unique_filename)


def get_mime_type(filename: str) -> Optional[str]:
    """Get MIME type of file"""
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type


def delete_file(file_path: str) -> bool:
    """Delete uploaded file"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception as e:
        print(f"Error deleting file: {e}")
        return False
