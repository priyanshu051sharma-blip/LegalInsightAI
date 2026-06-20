# 👨‍💻 Developer's Handbook - Enterprise Features

## Quick Reference Guide for Using All 12 Enterprise Features

---

## 1. 📊 Analytics Dashboard

### File Location
- **Frontend**: [frontend/src/components/AnalyticsDashboard.tsx](frontend/src/components/AnalyticsDashboard.tsx)

### How to Use

```typescript
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function AnalyticsPage() {
  return <AnalyticsDashboard />;
}
```

### Features Provided
- 4 key metric cards (Total Documents, Completed Analyses, High Risk Count, Compliance Rate)
- Line chart showing analysis trends
- Pie chart showing risk distribution
- Bar chart showing top issues
- Team metrics section

### Data Refresh
```typescript
// Component auto-fetches data on mount
useEffect(() => {
  fetchAnalyticsData();
}, []);

// Manual refresh
const handleRefresh = async () => {
  const data = await fetch('/api/v1/analytics/overview');
  setMetrics(data);
};
```

### Customization
- Edit `MetricCard` component to add/remove metrics
- Modify chart colors in Recharts configuration
- Change refresh interval via `ANALYTICS_REFRESH_INTERVAL` constant

---

## 2. 🎯 Landing Page

### File Location
- **Frontend**: [frontend/src/pages/landing.tsx](frontend/src/pages/landing.tsx)

### Navigation
- Automatically displays to unauthenticated users
- Route: `/` (homepage)
- "Get Started" button → Sign up flow
- "Sign In" link → Login page

### Customization Points

```typescript
// Update company name
const COMPANY_NAME = "Your Legal AI";

// Update hero text
const HERO_TITLE = "AI-Powered Legal Document Analysis";
const HERO_SUBTITLE = "...";

// Update features array
const features = [
  { icon: "⚡", title: "Real-time Analysis", ... },
  // Add more features
];

// Update pricing tiers
const pricingTiers = [
  { name: "Starter", price: "$99", features: [...] },
  // Add more tiers
];
```

### SEO & Meta Tags
```typescript
// Already included:
<title>Legal Assistant - AI Document Analysis</title>
<meta name="description" content="..." />
<meta name="og:image" content="..." />
```

---

## 3. 👥 Team Collaboration Page

### File Location
- **Frontend**: [frontend/src/pages/team.tsx](frontend/src/pages/team.tsx)

### Tabs Available

#### Members Tab
```typescript
// Show all team members
const members = [
  { id: 1, name: "John Doe", role: "LAWYER", email: "john@..." },
  // More members
];

// Invite new member
const handleInvite = async (email, role) => {
  await fetch('/api/v1/team/invite', {
    method: 'POST',
    body: JSON.stringify({ email, role })
  });
  // Email automatically sent via email service
};
```

#### Shared Tab
```typescript
// Display documents shared with user
const sharedDocuments = [
  { id: 1, title: "Contract A", sharedBy: "Jane", permissions: "view" },
  // More documents
];

// Request access to document
const requestAccess = async (docId) => {
  await fetch(`/api/v1/documents/${docId}/access-request`, {
    method: 'POST'
  });
};
```

#### Activity Tab
```typescript
// Real-time activity stream
const activities = [
  { type: "DOCUMENT_SHARED", user: "Jane", target: "Contract A", time: "2 hours ago" },
  // More activities
];
```

### Role Color Mapping
```typescript
const roleColors = {
  'SUPER_ADMIN': '#dc2626', // Red
  'ADMIN': '#7c3aed',        // Purple
  'MANAGER': '#2563eb',      // Blue
  'LAWYER': '#059669',       // Green
  'PARALEGAL': '#ea580c',    // Orange
  'VIEWER': '#6b7280'        // Gray
};
```

---

## 4. ⚙️ Admin Dashboard

### File Location
- **Frontend**: [frontend/src/pages/admin.tsx](frontend/src/pages/admin.tsx)

### Access Control
```typescript
// Only SUPER_ADMIN and ADMIN can access
if (!['SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
  return <AccessDenied />;
}
```

### Tabs & Functionality

#### System Overview Tab
```typescript
// Displays system health
const systemHealth = {
  database: 'healthy',
  cache: 'healthy',
  email_service: 'healthy',
  api_response_time: '145ms'
};

// Resource usage
const resources = {
  database_size: '48GB',
  storage_used: '250GB',
  uptime: '99.97%'
};
```

#### Users Tab
```typescript
// User management CRUD
const handleEditUser = async (userId, updates) => {
  await fetch(`/api/v1/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
};

const handleDisableUser = async (userId) => {
  await fetch(`/api/v1/admin/users/${userId}/disable`, {
    method: 'POST'
  });
};

const handleDeleteUser = async (userId) => {
  await fetch(`/api/v1/admin/users/${userId}`, {
    method: 'DELETE'
  });
};
```

#### Audit Logs Tab
```typescript
// View complete action history
const auditLogs = [
  { 
    id: 1, 
    action: 'USER_LOGIN', 
    user: 'john@example.com', 
    timestamp: '2024-01-15 14:30:00',
    ip: '192.168.1.100',
    status: 'SUCCESS'
  },
  // More logs
];

// Filter logs
const handleFilter = (action, user, dateRange) => {
  // Fetch filtered logs from backend
};
```

#### Settings Tab
```typescript
// System configuration
const settings = {
  email_enabled: true,
  smtp_host: 'smtp.gmail.com',
  rate_limit_enabled: true,
  rate_limit_requests: 1000,
  backup_frequency: 'daily'
};

// Update settings
const updateSetting = async (key, value) => {
  await fetch('/api/v1/admin/settings', {
    method: 'PUT',
    body: JSON.stringify({ [key]: value })
  });
};
```

---

## 5. 🔐 Role-Based Access Control (RBAC)

### File Location
- **Backend**: [backend/app/utils/rbac.py](backend/app/utils/rbac.py)

### Using RBAC

```python
from app.utils.rbac import Role, Permission, has_permission

# Check if user has specific permission
@app.post('/documents/{id}/delete')
async def delete_document(id: str, user: User):
    if not has_permission(user.role, Permission.DELETE_DOCUMENT):
        raise HTTPException(status_code=403, detail="Not permitted")
    
    # Delete document
    return {"success": True}
```

### Role Hierarchy

```python
ROLE_PERMISSIONS = {
    Role.SUPER_ADMIN: [
        # All 30+ permissions
        Permission.MANAGE_USERS,
        Permission.VIEW_AUDIT_LOGS,
        Permission.UPDATE_SYSTEM_SETTINGS,
        # ... all other permissions
    ],
    Role.ADMIN: [
        # Most permissions except system settings
        Permission.MANAGE_USERS,
        Permission.MANAGE_TEAMS,
        Permission.VIEW_ALL_DOCUMENTS,
        # ... other admin permissions
    ],
    Role.MANAGER: [
        # Team and document permissions
        Permission.MANAGE_TEAM_MEMBERS,
        Permission.VIEW_TEAM_DOCUMENTS,
        Permission.SHARE_DOCUMENTS,
    ],
    Role.LAWYER: [
        # Document analysis permissions
        Permission.UPLOAD_DOCUMENTS,
        Permission.ANALYZE_DOCUMENTS,
        Permission.GENERATE_REPORTS,
    ],
    Role.PARALEGAL: [
        # Limited analysis permissions
        Permission.UPLOAD_DOCUMENTS,
        Permission.VIEW_RESULTS,
    ],
    Role.VIEWER: [
        # Read-only permissions
        Permission.VIEW_DOCUMENTS,
        Permission.VIEW_RESULTS,
    ]
}
```

### Multiple Permission Checks

```python
# Check if user has ANY of the permissions
if has_any_permission(user.role, [
    Permission.MANAGE_USERS,
    Permission.MANAGE_TEAMS,
    Permission.MANAGE_ORGANIZATION
]):
    # User is a manager of some kind
    pass

# Check if user has ALL permissions
if has_all_permissions(user.role, [
    Permission.UPLOAD_DOCUMENTS,
    Permission.ANALYZE_DOCUMENTS,
    Permission.VIEW_RESULTS
]):
    # User is a full-access lawyer
    pass
```

---

## 6. 📋 Audit Logging

### File Location
- **Backend**: [backend/app/utils/audit_logger.py](backend/app/utils/audit_logger.py)

### Logging Actions

```python
from app.utils.audit_logger import audit_logger, AuditAction

# Log user login
await audit_logger.log_user_login(
    user_id="user123",
    ip_address="192.168.1.100"
)

# Log document upload
await audit_logger.log_document_upload(
    user_id="user123",
    document_id="doc456",
    file_name="contract.pdf"
)

# Log analysis started
await audit_logger.log_analysis_started(
    user_id="user123",
    document_id="doc456",
    analysis_type="comprehensive"
)

# Generic log
await audit_logger.log(
    action=AuditAction.PERMISSION_CHANGED,
    user_id="user123",
    resource_id="org789",
    resource_type="organization",
    details={"old_role": "LAWYER", "new_role": "MANAGER"},
    status="SUCCESS"
)
```

### Retrieving Audit Logs

```python
# Get audit trail for specific resource
logs = await audit_logger.get_audit_trail(
    resource_id="doc456",
    resource_type="document"
)

# Get user activity
user_activity = await audit_logger.get_user_activity(
    user_id="user123",
    days=30
)

# Get all logs with pagination
all_logs = await audit_logger.get_audit_logs(
    skip=0,
    limit=100,
    action=AuditAction.DOCUMENT_DOWNLOADED
)
```

### Action Types Available

```python
AuditAction.USER_LOGIN
AuditAction.USER_LOGOUT
AuditAction.USER_CREATED
AuditAction.USER_UPDATED
AuditAction.DOCUMENT_UPLOADED
AuditAction.DOCUMENT_ANALYZED
AuditAction.DOCUMENT_DOWNLOADED
AuditAction.DOCUMENT_SHARED
AuditAction.REPORT_GENERATED
AuditAction.REPORT_EXPORTED
AuditAction.ANALYSIS_STARTED
AuditAction.ANALYSIS_COMPLETED
AuditAction.PERMISSION_CHANGED
AuditAction.ROLE_ASSIGNED
AuditAction.TEAM_CREATED
AuditAction.TEAM_MEMBER_ADDED
AuditAction.TEAM_MEMBER_REMOVED
```

---

## 7. 🔄 Batch Document Processing

### File Location
- **Backend**: [backend/app/services/batch_processor.py](backend/app/services/batch_processor.py)

### Creating & Processing Batches

```python
from app.services.batch_processor import batch_processor

# Create batch job
batch = await batch_processor.create_batch(
    user_id="user123",
    organization_id="org456",
    document_ids=["doc1", "doc2", "doc3", "doc4", "doc5"],
    analysis_type="comprehensive"
)
print(f"Batch created: {batch['id']}")

# Process batch (returns status updates)
results = await batch_processor.process_batch(batch['id'])
print(f"Processed {len(results)} documents")

# Get batch status
status = await batch_processor.get_batch_status(batch['id'])
print(f"Status: {status['status']}")  # QUEUED, PROCESSING, COMPLETED, PARTIAL, FAILED
print(f"Progress: {status['progress']}%")
print(f"Processed: {status['processed_count']}/{status['total_count']}")

# Get results
results = await batch_processor.get_batch_results(batch['id'])
for result in results:
    print(f"Document {result['document_id']}: {result['status']}")
    if result['status'] == 'COMPLETED':
        print(f"  Risk Score: {result['analysis']['risk_score']}")
    else:
        print(f"  Error: {result['error']}")
```

### Concurrency Control

```python
# Maximum concurrent documents (configurable)
MAX_CONCURRENT = 5  # Set in config

# Uses asyncio.Semaphore to limit concurrent processing
# If processing 20 documents with MAX_CONCURRENT=5:
# - 5 documents process simultaneously
# - When one completes, next in queue starts
# - Total time: ~4x the single document time (instead of 20x)
```

### API Endpoints

```bash
# Create batch
POST /api/v1/batch/create
{
  "document_ids": ["doc1", "doc2"],
  "analysis_type": "comprehensive"
}

# Get status
GET /api/v1/batch/{batch_id}

# Get results
GET /api/v1/batch/{batch_id}/results

# Cancel batch
POST /api/v1/batch/{batch_id}/cancel
```

---

## 8. 📧 Email Notification Service

### File Location
- **Backend**: [backend/app/services/email_service.py](backend/app/services/email_service.py)

### Sending Emails

```python
from app.services.email_service import email_service

# Send analysis complete email
await email_service.send_analysis_complete(
    recipient_email="user@example.com",
    user_name="John Doe",
    document_title="Q3 Contract Review",
    analysis_data={
        'risk_score': 68,
        'high_risk_items': 3,
        'compliance_issues': 2,
        'dashboard_url': 'https://app.com/documents/doc123'
    }
)

# Send team invitation
await email_service.send_team_invitation(
    recipient_email="newmember@example.com",
    inviter_name="Jane Smith",
    organization_name="Legal Firm ABC",
    role="LAWYER",
    invitation_link="https://app.com/join?token=xyz"
)

# Send password reset
await email_service.send_password_reset(
    recipient_email="user@example.com",
    user_name="John Doe",
    reset_link="https://app.com/reset?token=abc123"
)

# Send generic email
await email_service.send_email(
    recipient_email="user@example.com",
    subject="Important Notification",
    html_content="<p>Your analysis is complete</p>",
    text_content="Your analysis is complete"
)
```

### Email Configuration

```bash
# Set in .env file:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-specific-password
EMAIL_FROM_NAME="Legal Assistant"
```

### Gmail App Password Setup

1. Enable 2-factor authentication on Gmail
2. Go to https://myaccount.google.com/apppasswords
3. Create app password for "Mail" and "Windows"
4. Copy the generated password to `.env` as `SENDER_PASSWORD`

---

## 9. 📄 Professional Report Generation

### File Location
- **Backend**: [backend/app/services/report_service.py](backend/app/services/report_service.py)

### Generating Reports

```python
from app.services.report_service import ReportGenerator

# Create report generator
generator = ReportGenerator()

# Generate PDF
analysis_data = {
    'document_title': 'Employment Contract',
    'analysis_type': 'comprehensive',
    'summary': 'This employment contract includes standard clauses...',
    'risk_score': 45,
    'risk_level': 'MEDIUM',
    'key_terms': ['Employment Duration: 3 years', 'Salary: $120,000/year'],
    'obligations': ['Non-compete: 2 years', 'Confidentiality: Perpetual'],
    'deadlines': ['Notice period: 30 days'],
    'compliance_status': 'COMPLIANT',
    'violations': [],
    'high_risk_clauses': [
        {'clause': 'Non-compete', 'reason': 'May be unenforceable'}
    ],
    'medium_risk_clauses': [],
    'recommendations': [
        'Review non-compete clause with state law',
        'Clarify termination provisions'
    ],
    'precedents': [
        'Smith v. XYZ Corp (2020) - Non-compete enforcement'
    ],
    'metadata': {
        'generated_at': '2024-01-15',
        'generated_by': 'John Doe',
        'organization': 'Legal Firm ABC'
    }
}

# Generate PDF (returns BytesIO)
pdf_buffer = await generator.generate(analysis_data)

# Save to file
with open('report.pdf', 'wb') as f:
    f.write(pdf_buffer.getvalue())

# Or return as response
return FileResponse(
    pdf_buffer,
    media_type='application/pdf',
    filename='analysis_report.pdf'
)
```

### Report Structure

```
1. Title Page
   - Document title
   - Generated date & time
   - Organization name
   - Generated by

2. Executive Summary
   - Key metrics in table
   - Risk score and level
   - Compliance status

3. Risk Analysis
   - High risk clauses (red)
   - Medium risk clauses (yellow)
   - Low risk clauses (green)
   - Recommendations

4. Compliance Section
   - GDPR, HIPAA, CCPA, SOX status
   - Violations found
   - Compliance recommendations

5. Key Terms & Obligations
   - Important deadlines
   - Key obligations
   - Payment terms

6. Legal Research
   - Relevant precedents
   - Case citations
   - Applicable law

7. Recommendations
   - Action items prioritized
   - Implementation guidance
```

### API Endpoint

```bash
# Generate and download report
POST /api/v1/documents/{document_id}/report/generate
Response: PDF file (application/pdf)

# Generate and email report
POST /api/v1/documents/{document_id}/report/generate
{
  "send_email": true,
  "recipient_email": "user@example.com"
}
```

---

## 10. 🔌 WebSocket Real-time Updates

### File Location
- **Backend**: [backend/app/utils/websocket_manager.py](backend/app/utils/websocket_manager.py)

### Connecting to WebSocket

```typescript
// Frontend connection
const connectWebSocket = (userId: string, roomId: string) => {
  const ws = new WebSocket(
    `ws://localhost:8000/api/v1/ws/${userId}/${roomId}`
  );

  ws.onopen = () => {
    console.log('Connected to real-time updates');
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    
    switch(message.type) {
      case 'ANALYSIS_STARTED':
        updateUI('Analysis started...');
        break;
      case 'ANALYSIS_PROGRESS':
        updateProgressBar(message.progress);
        break;
      case 'ANALYSIS_COMPLETED':
        showResults(message.data);
        break;
      case 'USER_JOINED':
        addUserToList(message.user);
        break;
      case 'COMMENT_RECEIVED':
        addCommentToUI(message.comment);
        break;
      case 'NOTIFICATION':
        showNotification(message.content);
        break;
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('Disconnected from real-time updates');
  };

  return ws;
};
```

### Backend Event Broadcasting

```python
from app.utils.websocket_manager import ws_manager, EventType

# Send progress update to all users in room
await ws_manager.send_analysis_progress(
    room_id="analysis_session_123",
    progress=50,
    current_stage="Risk Analysis"
)

# Send analysis completion
await ws_manager.send_analysis_completed(
    room_id="analysis_session_123",
    analysis_data={...}
)

# Send notification to specific user
await ws_manager.send_notification(
    user_id="user123",
    message="Your analysis is complete",
    type="success"
)

# Broadcast custom event to room
await ws_manager.broadcast_event(
    room_id="analysis_session_123",
    event_type=EventType.COMMENT_ADDED,
    data={'user': 'Jane', 'comment': 'This clause needs review'}
)
```

### WebSocket Endpoint

```python
@router.websocket("/ws/{user_id}/{room_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, room_id: str):
    await ws_manager.connect(websocket, user_id, room_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            # Process incoming messages
            if data['action'] == 'send_comment':
                await ws_manager.broadcast_event(
                    room_id,
                    EventType.COMMENT_ADDED,
                    data
                )
    except Exception as e:
        await ws_manager.disconnect(user_id, room_id)
```

---

## 11. 🛣️ Advanced API Routes

### File Location
- **Backend**: [backend/app/routes/advanced_routes.py](backend/app/routes/advanced_routes.py)

### Available Endpoints

```bash
# WebSocket
WebSocket /ws/{user_id}/{room_id}
  - Real-time analysis progress
  - Comments and collaboration
  - Presence updates
  - Notifications

# Batch Processing
POST   /batch/create                    # Create batch job
GET    /batch/{id}                      # Get batch status
GET    /batch/{id}/results              # Get batch results
POST   /batch/{id}/cancel               # Cancel batch

# Reports
POST   /documents/{id}/report/generate  # Generate PDF
GET    /documents/{id}/report/download  # Download report
POST   /documents/{id}/report/email     # Email report

# Real-time Analysis
POST   /documents/{id}/analyze/realtime # Start with progress updates
GET    /documents/{id}/analysis/status  # Get status

# Analytics
GET    /analytics/overview              # Dashboard metrics
GET    /analytics/trends                # Usage trends
GET    /analytics/top-issues            # Most common issues

# Audit
GET    /audit/logs                      # Get audit trail
GET    /audit/user/{user_id}            # User activity
POST   /audit/export                    # Export logs

# Team
POST   /team/invite                     # Invite member
GET    /team/members                    # List members
POST   /team/share                      # Share document

# Admin
GET    /system/health                   # System status
POST   /admin/settings                  # Update settings
GET    /admin/users                     # List all users
```

### Example API Usage

```python
# Frontend JavaScript
async function createBatch(documentIds) {
  const response = await fetch('/api/v1/batch/create', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      document_ids: documentIds,
      analysis_type: 'comprehensive'
    })
  });
  return response.json();
}

async function getBatchResults(batchId) {
  const response = await fetch(`/api/v1/batch/${batchId}/results`);
  return response.json();
}

// Connect to WebSocket
const ws = new WebSocket(
  `ws://localhost:8000/api/v1/ws/${userId}/${roomId}`
);
```

---

## 12. 🚀 Backend Services Integration

### File Location
- **Backend Configuration**: `backend/app/main.py`, `backend/requirements.txt`

### Service Initialization

```python
# All services are singletons and auto-initialized:

from app.services.report_service import report_generator
from app.services.batch_processor import batch_processor
from app.services.email_service import email_service
from app.utils.websocket_manager import ws_manager
from app.utils.audit_logger import audit_logger
from app.utils.rbac import ROLE_PERMISSIONS

# Use throughout application:
pdf = await report_generator.generate(data)
batch = await batch_processor.create_batch(docs)
await email_service.send_analysis_complete(email, data)
await ws_manager.broadcast_event(room, event_type, data)
await audit_logger.log(action, user_id, resource_id)
can_access = has_permission(user.role, permission)
```

### Configuration

```bash
# Backend .env file
DATABASE_URL=postgresql://user:pass@localhost:5432/legal_ai
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your-api-key
OPENAI_API_KEY=optional-openai-key

# Email configuration
SMTP_HOST=smtp.gmail.com
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=app-password

# WebSocket configuration
WS_MAX_CONNECTIONS=1000
WS_HEARTBEAT_INTERVAL=30

# Batch processing
MAX_CONCURRENT_BATCH=5

# API configuration
API_RATE_LIMIT=1000
API_RATE_WINDOW=60

# Monitoring
SENTRY_DSN=your-sentry-key
LOG_LEVEL=INFO
```

---

## 📚 Integration Examples

### Complete Document Analysis with All Features

```python
# 1. User uploads document
document = await document_service.upload(file, user_id)

# 2. Log upload action
await audit_logger.log_document_upload(user_id, document.id, file.filename)

# 3. Broadcast to team via WebSocket
await ws_manager.broadcast_event(room_id, EventType.DOCUMENT_UPLOADED, 
  {'document': document.title})

# 4. Start real-time analysis
analysis_results = await ai_agent_orchestrator.analyze(
  document,
  notify_progress=lambda p: ws_manager.send_analysis_progress(room_id, p)
)

# 5. Save results to database
saved_analysis = await document_service.save_analysis(analysis_results)

# 6. Log analysis completion
await audit_logger.log_analysis_completed(user_id, document.id, analysis_results)

# 7. Send email notification
await email_service.send_analysis_complete(
  user_id.email,
  user_id.name,
  document.title,
  analysis_results
)

# 8. Generate professional report
pdf_buffer = await report_generator.generate(analysis_results)

# 9. Send WebSocket completion notification
await ws_manager.send_analysis_completed(room_id, analysis_results)

# 10. Make report available for download
report_url = await document_service.save_report(pdf_buffer, document.id)

# 11. Log report generation
await audit_logger.log_report_generated(user_id, document.id)

# 12. Update analytics
await analytics_service.record_analysis_completed(user_id, analysis_results)
```

### Team Collaboration Workflow

```typescript
// 1. User shares document with team
await fetch('/api/v1/team/share', {
  method: 'POST',
  body: JSON.stringify({
    document_id: 'doc123',
    user_ids: ['user2', 'user3'],
    permission: 'comment'
  })
});

// 2. WebSocket notifies team members of share
// Event received: DOCUMENT_SHARED

// 3. Team members connect to real-time room
const ws = new WebSocket(`ws:///.../ws/user2/doc123`);

// 4. Share analysis report
await fetch(`/api/v1/documents/doc123/report/email`, {
  method: 'POST',
  body: JSON.stringify({
    recipients: ['user2@example.com', 'user3@example.com']
  })
});

// 5. Team members receive email with report link
// Email service sends AnalysisCompleteEmail template

// 6. Audit log records all sharing actions
// Admin can view: Team member added, Document shared, Report emailed
```

---

## 🔍 Debugging Guide

### Check WebSocket Connection
```javascript
// Browser console
console.log(ws.readyState);
// 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
```

### View Backend Logs
```bash
docker-compose logs -f backend
# Look for: [INFO], [WARNING], [ERROR]
```

### Check Database Connection
```python
from app.db import get_db
async with get_db() as db:
    result = await db.execute("SELECT 1")
    print("Database connected:", result)
```

### Test Email Service
```python
from app.services.email_service import email_service
await email_service.send_email(
    "test@example.com",
    "Test Subject",
    "Test body",
    "Test body"
)
```

### Verify RBAC Permissions
```python
from app.utils.rbac import has_permission, Permission, Role
print(has_permission(Role.LAWYER, Permission.ANALYZE_DOCUMENTS))  # True
print(has_permission(Role.VIEWER, Permission.UPLOAD_DOCUMENTS))   # False
```

---

## 🎯 Common Tasks

### Add New API Endpoint
1. Create function in `advanced_routes.py`
2. Add RBAC permission check: `@require_permission(Permission.XXX)`
3. Add audit logging: `await audit_logger.log(...)`
4. Return JSON response
5. Document in API.md

### Add New Email Template
1. Create class extending `EmailTemplate`
2. Implement: `get_subject()`, `get_html_body()`, `get_text_body()`
3. Add method to `EmailService`
4. Use: `await email_service.send_XXX(...)`

### Add New Role
1. Add to `Role` enum in `rbac.py`
2. Define permissions in `ROLE_PERMISSIONS` dict
3. Update database migration
4. Update UI role selector

### Scale Batch Processing
1. Increase `MAX_CONCURRENT_BATCH` in config
2. Monitor database connection pool
3. Watch Redis memory usage
4. Consider horizontal scaling

---

**Happy coding! 🚀 All 12 features are ready to use!**
