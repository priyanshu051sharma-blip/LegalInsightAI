"""
Audit Logging System

Tracks all user actions for compliance and security:
- Document operations
- Analysis operations
- User management
- Settings changes
- Login/logout events
"""

from typing import Dict, Any, Optional
from datetime import datetime
from enum import Enum


class AuditAction(str, Enum):
    """Audit log actions"""
    # User actions
    USER_LOGIN = "user:login"
    USER_LOGOUT = "user:logout"
    USER_CREATED = "user:created"
    USER_DELETED = "user:deleted"
    USER_UPDATED = "user:updated"
    USER_ROLE_CHANGED = "user:role_changed"
    
    # Document actions
    DOCUMENT_UPLOADED = "document:uploaded"
    DOCUMENT_DELETED = "document:deleted"
    DOCUMENT_SHARED = "document:shared"
    DOCUMENT_DOWNLOADED = "document:downloaded"
    DOCUMENT_EXPORTED = "document:exported"
    
    # Analysis actions
    ANALYSIS_STARTED = "analysis:started"
    ANALYSIS_COMPLETED = "analysis:completed"
    ANALYSIS_FAILED = "analysis:failed"
    ANALYSIS_EXPORTED = "analysis:exported"
    
    # Team actions
    TEAM_MEMBER_ADDED = "team:member_added"
    TEAM_MEMBER_REMOVED = "team:member_removed"
    TEAM_CREATED = "team:created"
    TEAM_UPDATED = "team:updated"
    
    # Settings actions
    SETTINGS_UPDATED = "settings:updated"
    PASSWORD_CHANGED = "password:changed"
    API_KEY_GENERATED = "api_key:generated"
    API_KEY_REVOKED = "api_key:revoked"
    
    # System actions
    SYSTEM_BACKUP = "system:backup"
    SYSTEM_RESTORE = "system:restore"
    CONFIG_UPDATED = "config:updated"


class AuditLogger:
    """Logs all system actions for audit trail"""

    def __init__(self, db_session=None):
        self.db_session = db_session

    async def log(self, 
                 action: AuditAction,
                 user_id: str,
                 resource_type: str,
                 resource_id: Optional[str] = None,
                 details: Optional[Dict[str, Any]] = None,
                 ip_address: Optional[str] = None,
                 status: str = "success",
                 error_message: Optional[str] = None) -> Dict[str, Any]:
        """Log an action"""
        
        audit_entry = {
            "action": action.value,
            "user_id": user_id,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "details": details or {},
            "ip_address": ip_address,
            "status": status,
            "error_message": error_message,
            "timestamp": datetime.utcnow().isoformat(),
        }
        
        # Save to database if available
        if self.db_session:
            try:
                # Assuming AuditLog model exists
                # log_entry = AuditLog(**audit_entry)
                # self.db_session.add(log_entry)
                # await self.db_session.commit()
                pass
            except Exception as e:
                print(f"Error saving audit log: {e}")
        
        return audit_entry

    async def log_user_login(self, user_id: str, ip_address: str) -> Dict[str, Any]:
        """Log user login"""
        return await self.log(
            action=AuditAction.USER_LOGIN,
            user_id=user_id,
            resource_type="user",
            resource_id=user_id,
            ip_address=ip_address,
        )

    async def log_user_logout(self, user_id: str, ip_address: str) -> Dict[str, Any]:
        """Log user logout"""
        return await self.log(
            action=AuditAction.USER_LOGOUT,
            user_id=user_id,
            resource_type="user",
            resource_id=user_id,
            ip_address=ip_address,
        )

    async def log_document_upload(self, user_id: str, document_id: str, 
                                 filename: str, size: int) -> Dict[str, Any]:
        """Log document upload"""
        return await self.log(
            action=AuditAction.DOCUMENT_UPLOADED,
            user_id=user_id,
            resource_type="document",
            resource_id=document_id,
            details={
                "filename": filename,
                "size_bytes": size,
            }
        )

    async def log_analysis_started(self, user_id: str, document_id: str, 
                                  analysis_type: str) -> Dict[str, Any]:
        """Log analysis start"""
        return await self.log(
            action=AuditAction.ANALYSIS_STARTED,
            user_id=user_id,
            resource_type="analysis",
            resource_id=document_id,
            details={
                "document_id": document_id,
                "analysis_type": analysis_type,
            }
        )

    async def log_analysis_completed(self, user_id: str, document_id: str, 
                                    analysis_type: str, 
                                    risk_score: float) -> Dict[str, Any]:
        """Log analysis completion"""
        return await self.log(
            action=AuditAction.ANALYSIS_COMPLETED,
            user_id=user_id,
            resource_type="analysis",
            resource_id=document_id,
            details={
                "document_id": document_id,
                "analysis_type": analysis_type,
                "risk_score": risk_score,
            }
        )

    async def log_document_shared(self, user_id: str, document_id: str, 
                                 shared_with_user_id: str, 
                                 permission_level: str) -> Dict[str, Any]:
        """Log document sharing"""
        return await self.log(
            action=AuditAction.DOCUMENT_SHARED,
            user_id=user_id,
            resource_type="document",
            resource_id=document_id,
            details={
                "shared_with_user_id": shared_with_user_id,
                "permission_level": permission_level,
            }
        )

    async def log_user_role_changed(self, admin_user_id: str, target_user_id: str,
                                   old_role: str, new_role: str) -> Dict[str, Any]:
        """Log user role change"""
        return await self.log(
            action=AuditAction.USER_ROLE_CHANGED,
            user_id=admin_user_id,
            resource_type="user",
            resource_id=target_user_id,
            details={
                "old_role": old_role,
                "new_role": new_role,
                "target_user_id": target_user_id,
            }
        )

    async def log_settings_updated(self, user_id: str, setting_key: str,
                                  old_value: Any, new_value: Any) -> Dict[str, Any]:
        """Log settings change"""
        return await self.log(
            action=AuditAction.SETTINGS_UPDATED,
            user_id=user_id,
            resource_type="settings",
            resource_id=setting_key,
            details={
                "setting_key": setting_key,
                "old_value": str(old_value),
                "new_value": str(new_value),
            }
        )

    async def get_audit_trail(self, resource_id: str, 
                            limit: int = 100) -> list[Dict[str, Any]]:
        """Get audit trail for a resource"""
        # This would query the database
        # For now, returns empty list
        return []

    async def get_user_activity(self, user_id: str, 
                               limit: int = 100) -> list[Dict[str, Any]]:
        """Get activity log for a user"""
        # This would query the database
        # For now, returns empty list
        return []


# Global audit logger instance
audit_logger = AuditLogger()
