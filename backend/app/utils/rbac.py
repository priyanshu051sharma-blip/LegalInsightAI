"""
Role-Based Access Control (RBAC) System

Roles:
- SUPER_ADMIN: Full system access
- ADMIN: Team/organization management
- MANAGER: Document oversight
- LAWYER: Full analysis access
- PARALEGAL: Limited analysis
- VIEWER: Read-only access
"""

from enum import Enum
from typing import Set


class Role(str, Enum):
    """User roles in the system"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MANAGER = "manager"
    LAWYER = "lawyer"
    PARALEGAL = "paralegal"
    VIEWER = "viewer"


class Permission(str, Enum):
    """System permissions"""
    # Document permissions
    CREATE_DOCUMENT = "create:document"
    READ_DOCUMENT = "read:document"
    UPDATE_DOCUMENT = "update:document"
    DELETE_DOCUMENT = "delete:document"
    SHARE_DOCUMENT = "share:document"
    
    # Analysis permissions
    CREATE_ANALYSIS = "create:analysis"
    READ_ANALYSIS = "read:analysis"
    UPDATE_ANALYSIS = "update:analysis"
    DELETE_ANALYSIS = "delete:analysis"
    
    # Case permissions
    CREATE_CASE = "create:case"
    READ_CASE = "read:case"
    UPDATE_CASE = "update:case"
    DELETE_CASE = "delete:case"
    
    # Team permissions
    MANAGE_TEAM = "manage:team"
    INVITE_USER = "invite:user"
    REMOVE_USER = "remove:user"
    CHANGE_ROLE = "change:role"
    
    # Organization permissions
    MANAGE_ORG = "manage:org"
    VIEW_BILLING = "view:billing"
    MANAGE_BILLING = "manage:billing"
    
    # Admin permissions
    MANAGE_SYSTEM = "manage:system"
    VIEW_AUDIT_LOG = "view:audit"
    MANAGE_SETTINGS = "manage:settings"
    MANAGE_TEMPLATES = "manage:templates"


# Role to permissions mapping
ROLE_PERMISSIONS: dict[Role, Set[Permission]] = {
    Role.SUPER_ADMIN: set(Permission),  # All permissions
    
    Role.ADMIN: {
        Permission.CREATE_DOCUMENT,
        Permission.READ_DOCUMENT,
        Permission.UPDATE_DOCUMENT,
        Permission.DELETE_DOCUMENT,
        Permission.SHARE_DOCUMENT,
        Permission.CREATE_ANALYSIS,
        Permission.READ_ANALYSIS,
        Permission.UPDATE_ANALYSIS,
        Permission.DELETE_ANALYSIS,
        Permission.CREATE_CASE,
        Permission.READ_CASE,
        Permission.UPDATE_CASE,
        Permission.DELETE_CASE,
        Permission.MANAGE_TEAM,
        Permission.INVITE_USER,
        Permission.REMOVE_USER,
        Permission.CHANGE_ROLE,
        Permission.MANAGE_ORG,
        Permission.VIEW_BILLING,
        Permission.VIEW_AUDIT_LOG,
    },
    
    Role.MANAGER: {
        Permission.CREATE_DOCUMENT,
        Permission.READ_DOCUMENT,
        Permission.UPDATE_DOCUMENT,
        Permission.DELETE_DOCUMENT,
        Permission.SHARE_DOCUMENT,
        Permission.CREATE_ANALYSIS,
        Permission.READ_ANALYSIS,
        Permission.UPDATE_ANALYSIS,
        Permission.DELETE_ANALYSIS,
        Permission.CREATE_CASE,
        Permission.READ_CASE,
        Permission.UPDATE_CASE,
        Permission.DELETE_CASE,
        Permission.VIEW_AUDIT_LOG,
    },
    
    Role.LAWYER: {
        Permission.CREATE_DOCUMENT,
        Permission.READ_DOCUMENT,
        Permission.UPDATE_DOCUMENT,
        Permission.DELETE_DOCUMENT,
        Permission.SHARE_DOCUMENT,
        Permission.CREATE_ANALYSIS,
        Permission.READ_ANALYSIS,
        Permission.UPDATE_ANALYSIS,
        Permission.DELETE_ANALYSIS,
        Permission.CREATE_CASE,
        Permission.READ_CASE,
        Permission.UPDATE_CASE,
        Permission.DELETE_CASE,
    },
    
    Role.PARALEGAL: {
        Permission.CREATE_DOCUMENT,
        Permission.READ_DOCUMENT,
        Permission.UPDATE_DOCUMENT,
        Permission.CREATE_ANALYSIS,
        Permission.READ_ANALYSIS,
        Permission.READ_CASE,
        Permission.UPDATE_CASE,
    },
    
    Role.VIEWER: {
        Permission.READ_DOCUMENT,
        Permission.READ_ANALYSIS,
        Permission.READ_CASE,
    },
}


def get_permissions_for_role(role: Role) -> Set[Permission]:
    """Get all permissions for a role"""
    return ROLE_PERMISSIONS.get(role, set())


def has_permission(role: Role, permission: Permission) -> bool:
    """Check if role has permission"""
    return permission in get_permissions_for_role(role)


def has_any_permission(role: Role, permissions: list[Permission]) -> bool:
    """Check if role has any of the permissions"""
    role_perms = get_permissions_for_role(role)
    return any(perm in role_perms for perm in permissions)


def has_all_permissions(role: Role, permissions: list[Permission]) -> bool:
    """Check if role has all permissions"""
    role_perms = get_permissions_for_role(role)
    return all(perm in role_perms for perm in permissions)
