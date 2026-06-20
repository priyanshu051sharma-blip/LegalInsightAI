"""
WebSocket Manager for Real-time Updates

Handles:
- Live analysis progress updates
- Real-time notifications
- Document processing status
- Team collaboration features
"""

from typing import Dict, Set, Any, Callable, Optional
from datetime import datetime
import json
import asyncio
from fastapi import WebSocket
from enum import Enum


class EventType(str, Enum):
    """WebSocket event types"""
    ANALYSIS_STARTED = "analysis_started"
    ANALYSIS_PROGRESS = "analysis_progress"
    ANALYSIS_COMPLETED = "analysis_completed"
    ANALYSIS_ERROR = "analysis_error"
    DOCUMENT_PROCESSED = "document_processed"
    NOTIFICATION = "notification"
    TEAM_MEMBER_JOINED = "team_member_joined"
    TEAM_MEMBER_LEFT = "team_member_left"
    COMMENT_ADDED = "comment_added"
    STATUS_UPDATE = "status_update"


class WebSocketManager:
    """Manages WebSocket connections and broadcasts"""

    def __init__(self):
        # Active connections: {user_id: {room_id: websocket}}
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
        # Room subscriptions: {room_id: {user_id}}
        self.room_subscriptions: Dict[str, Set[str]] = {}
        # Event handlers: {event_type: [callback_functions]}
        self.event_handlers: Dict[EventType, list] = {event: [] for event in EventType}

    async def connect(self, websocket: WebSocket, user_id: str, room_id: str):
        """Register new WebSocket connection"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = {}
        
        self.active_connections[user_id][room_id] = websocket
        
        if room_id not in self.room_subscriptions:
            self.room_subscriptions[room_id] = set()
        
        self.room_subscriptions[room_id].add(user_id)
        
        # Notify others of new user
        await self.broadcast_event(
            room_id=room_id,
            event_type=EventType.TEAM_MEMBER_JOINED,
            data={"user_id": user_id, "timestamp": datetime.now().isoformat()}
        )

    async def disconnect(self, user_id: str, room_id: str):
        """Unregister WebSocket connection"""
        if user_id in self.active_connections:
            if room_id in self.active_connections[user_id]:
                del self.active_connections[user_id][room_id]
            
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        
        if room_id in self.room_subscriptions:
            self.room_subscriptions[room_id].discard(user_id)
            
            # Notify others of user leaving
            if self.room_subscriptions[room_id]:
                await self.broadcast_event(
                    room_id=room_id,
                    event_type=EventType.TEAM_MEMBER_LEFT,
                    data={"user_id": user_id, "timestamp": datetime.now().isoformat()}
                )

    async def broadcast_event(self, room_id: str, event_type: EventType, 
                            data: Dict[str, Any], exclude_user: Optional[str] = None):
        """Broadcast event to all users in room"""
        if room_id not in self.room_subscriptions:
            return
        
        message = {
            "event": event_type.value,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        
        disconnected_users = []
        
        for user_id in self.room_subscriptions[room_id]:
            if exclude_user and user_id == exclude_user:
                continue
            
            if user_id not in self.active_connections:
                disconnected_users.append(user_id)
                continue
            
            websocket = self.active_connections[user_id].get(room_id)
            if websocket:
                try:
                    await websocket.send_json(message)
                except Exception as e:
                    print(f"Error sending message to {user_id}: {e}")
                    disconnected_users.append(user_id)
        
        # Clean up disconnected users
        for user_id in disconnected_users:
            await self.disconnect(user_id, room_id)
        
        # Execute registered handlers
        await self._execute_handlers(event_type, data)

    async def send_analysis_progress(self, user_id: str, room_id: str, 
                                    document_id: str, progress: Dict[str, Any]):
        """Send analysis progress update"""
        await self.broadcast_event(
            room_id=room_id,
            event_type=EventType.ANALYSIS_PROGRESS,
            data={
                "document_id": document_id,
                "progress": progress,
                "timestamp": datetime.now().isoformat()
            },
            exclude_user=None
        )

    async def send_analysis_completed(self, room_id: str, document_id: str, 
                                     results: Dict[str, Any]):
        """Send analysis completion notification"""
        await self.broadcast_event(
            room_id=room_id,
            event_type=EventType.ANALYSIS_COMPLETED,
            data={
                "document_id": document_id,
                "results": results,
                "timestamp": datetime.now().isoformat()
            }
        )

    async def send_analysis_error(self, room_id: str, document_id: str, 
                                 error: str):
        """Send analysis error notification"""
        await self.broadcast_event(
            room_id=room_id,
            event_type=EventType.ANALYSIS_ERROR,
            data={
                "document_id": document_id,
                "error": error,
                "timestamp": datetime.now().isoformat()
            }
        )

    async def send_notification(self, user_id: str, room_id: str, 
                               title: str, message: str, 
                               notification_type: str = "info"):
        """Send notification to user"""
        if user_id in self.active_connections and room_id in self.active_connections[user_id]:
            try:
                await self.active_connections[user_id][room_id].send_json({
                    "event": EventType.NOTIFICATION.value,
                    "data": {
                        "title": title,
                        "message": message,
                        "type": notification_type,
                        "timestamp": datetime.now().isoformat()
                    }
                })
            except Exception as e:
                print(f"Error sending notification: {e}")

    async def broadcast_notification(self, room_id: str, title: str, 
                                    message: str, notification_type: str = "info"):
        """Broadcast notification to all users in room"""
        await self.broadcast_event(
            room_id=room_id,
            event_type=EventType.NOTIFICATION,
            data={
                "title": title,
                "message": message,
                "type": notification_type,
                "timestamp": datetime.now().isoformat()
            }
        )

    async def send_comment(self, room_id: str, user_id: str, username: str, 
                          document_id: str, comment: str):
        """Broadcast comment to room"""
        await self.broadcast_event(
            room_id=room_id,
            event_type=EventType.COMMENT_ADDED,
            data={
                "user_id": user_id,
                "username": username,
                "document_id": document_id,
                "comment": comment,
                "timestamp": datetime.now().isoformat()
            }
        )

    def register_handler(self, event_type: EventType, handler: Callable):
        """Register handler for event type"""
        if event_type not in self.event_handlers:
            self.event_handlers[event_type] = []
        self.event_handlers[event_type].append(handler)

    async def _execute_handlers(self, event_type: EventType, data: Dict[str, Any]):
        """Execute registered handlers for event"""
        if event_type in self.event_handlers:
            for handler in self.event_handlers[event_type]:
                try:
                    if asyncio.iscoroutinefunction(handler):
                        await handler(data)
                    else:
                        handler(data)
                except Exception as e:
                    print(f"Error executing handler: {e}")

    def get_room_users(self, room_id: str) -> Set[str]:
        """Get all users in a room"""
        return self.room_subscriptions.get(room_id, set())

    def get_user_rooms(self, user_id: str) -> Set[str]:
        """Get all rooms user is connected to"""
        return set(self.active_connections.get(user_id, {}).keys())

    async def close_all(self):
        """Close all connections"""
        for user_connections in self.active_connections.values():
            for websocket in user_connections.values():
                await websocket.close()
        
        self.active_connections.clear()
        self.room_subscriptions.clear()


# Global manager instance
ws_manager = WebSocketManager()
