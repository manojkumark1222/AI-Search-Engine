# Premium Features Implementation Guide

## Overview

This document describes the implementation of Pro and Business plan features for the AI Insight Hub application.

---

## Features Implemented

### 1. Subscription System ✅

#### Backend Components
- **Models** (`backend/models.py`):
  - Added `plan` field to User model (free, pro, business)
  - Added `subscription_expires_at` field for trial/paid subscriptions
  - Created `TeamMember` model for team collaboration
  - Created `ScheduledReport` model for scheduled reports
  - Created `ApiKey` model for API access

- **Plan Limits** (`backend/plan_limits.py`):
  - Centralized plan configuration with limits and features
  - Helper functions for plan validation
  - Feature access checking

- **Subscription Router** (`backend/routers/subscription.py`):
  - GET `/subscription/current` - Get current plan and features
  - POST `/subscription/upgrade` - Upgrade plan (for demo/testing)
  - POST `/subscription/downgrade` - Downgrade to free
  - GET `/subscription/plans` - Get all available plans

#### Migration
- **Migration Script** (`backend/migrate_add_subscription.py`):
  - Adds plan columns to users table
  - Creates team_members, scheduled_reports, and api_keys tables
  - Run: `python backend/migrate_add_subscription.py`

---

### 2. Connection Limits ✅

#### Implementation
- **Free Plan**: 1 connection
- **Pro Plan**: 10 connections
- **Business Plan**: Unlimited connections

#### Enforcement
- `backend/routers/connections.py`:
  - Checks connection limit before adding new connection
  - Returns 403 error with upgrade message if limit reached
  - Validates file size limits for CSV/Excel files

---

### 3. Query Limits ✅

#### Implementation
- **Free Plan**: 50 queries per month
- **Pro Plan**: Unlimited queries
- **Business Plan**: Unlimited queries

#### Enforcement
- `backend/routers/query.py`:
  - Checks monthly query count before executing query
  - Returns 403 error with upgrade message if limit reached
  - Tracks queries in QueryHistory table

---

### 4. Query History Limits ✅

#### Implementation
- **Free Plan**: 7 days retention
- **Pro Plan**: 90 days retention
- **Business Plan**: Unlimited retention

#### Enforcement
- `backend/routers/history.py`:
  - Filters query history based on plan retention period
  - Automatically excludes old queries beyond retention period

---

### 5. File Size Limits ✅

#### Implementation
- **Free Plan**: 5MB maximum
- **Pro Plan**: 50MB maximum
- **Business Plan**: Unlimited

#### Enforcement
- `backend/routers/connections.py`:
  - Validates file size when adding CSV/Excel connections
  - Returns 403 error if file exceeds plan limit

---

### 6. Export Functionality ✅

#### Implementation
- **Pro Plan**: ✅ Enabled
- **Business Plan**: ✅ Enabled
- **Free Plan**: ❌ Disabled

#### Features
- `backend/routers/export.py`:
  - POST `/export/excel` - Export to Excel format
  - POST `/export/csv` - Export to CSV format
  - POST `/export/pdf` - Export to PDF format (text-based for now)

#### Usage
```javascript
// Frontend example
const exportData = async (results, format) => {
  const response = await api.post(`/export/${format}`, {
    data: results,
    format: format,
    filename: `query_results_${Date.now()}.${format}`
  });
  // Download file
};
```

---

### 7. AI-Powered Insights ✅

#### Implementation
- **Pro Plan**: ✅ Enabled
- **Business Plan**: ✅ Enabled
- **Free Plan**: ❌ Disabled

#### Features
- `backend/routers/ai_insights.py`:
  - POST `/ai/analyze` - Generate insights from query results
  - POST `/ai/summary` - Get data summary

#### Insights Provided
- Statistical analysis (mean, median, min, max, std)
- Outlier detection
- Categorical analysis
- Missing value detection
- Data quality recommendations
- Trend analysis

#### Usage
```javascript
// Frontend example
const getInsights = async (queryResults) => {
  const response = await api.post('/ai/analyze', {
    data: queryResults,
    query_text: userQuery
  });
  return response.data;
};
```

---

### 8. Team Collaboration (Business Only) ✅

#### Implementation
- **Business Plan**: ✅ Enabled (up to 5 team members)
- **Pro Plan**: ❌ Disabled
- **Free Plan**: ❌ Disabled

#### Features
- `backend/routers/team.py`:
  - GET `/team/members` - Get all team members
  - POST `/team/invite` - Invite team member
  - DELETE `/team/members/{id}` - Remove team member
  - PUT `/team/members/{id}/role` - Update team member role

#### Roles
- **Owner**: Team creator, full access
- **Admin**: Can manage team members
- **Member**: Can access shared resources

---

### 9. API Access (Business Only) ✅

#### Implementation
- **Business Plan**: ✅ Enabled
- **Pro Plan**: ❌ Disabled
- **Free Plan**: ❌ Disabled

#### Features
- `backend/routers/api_keys.py`:
  - GET `/api-keys/keys` - Get all API keys
  - POST `/api-keys/keys` - Create new API key
  - DELETE `/api-keys/keys/{id}` - Delete API key
  - POST `/api-keys/keys/{id}/toggle` - Toggle API key status

#### API Key Format
- Format: `aiinsight_<32-character-random-string>`
- Secure random generation
- Track last used timestamp

---

### 10. Scheduled Reports (Business Only) 🔄

#### Implementation Status
- **Backend Models**: ✅ Created
- **Router**: ⏳ To be implemented
- **Scheduler**: ⏳ To be implemented

#### Planned Features
- Create scheduled reports (daily, weekly, monthly)
- Email recipients
- Automatic report generation
- Report history

---

### 11. Custom Dashboards (Business Only) 🔄

#### Implementation Status
- **Backend Models**: ⏳ To be created
- **Router**: ⏳ To be implemented
- **Frontend**: ⏳ To be implemented

#### Planned Features
- Create custom dashboards
- Save dashboard configurations
- Share dashboards with team
- Real-time updates

---

## API Endpoints Summary

### Subscription
- `GET /subscription/current` - Get current plan
- `POST /subscription/upgrade` - Upgrade plan
- `POST /subscription/downgrade` - Downgrade plan
- `GET /subscription/plans` - Get all plans

### Export
- `POST /export/excel` - Export to Excel
- `POST /export/csv` - Export to CSV
- `POST /export/pdf` - Export to PDF

### AI Insights
- `POST /ai/analyze` - Analyze data and generate insights
- `POST /ai/summary` - Get data summary

### Team Collaboration
- `GET /team/members` - Get team members
- `POST /team/invite` - Invite team member
- `DELETE /team/members/{id}` - Remove team member
- `PUT /team/members/{id}/role` - Update member role

### API Keys
- `GET /api-keys/keys` - Get API keys
- `POST /api-keys/keys` - Create API key
- `DELETE /api-keys/keys/{id}` - Delete API key
- `POST /api-keys/keys/{id}/toggle` - Toggle API key

---

## Plan Limits Reference

### Free Plan
- Connections: 1
- Queries: 50/month
- History: 7 days
- File Size: 5MB
- Export: ❌
- AI Insights: ❌
- Team: ❌
- API Access: ❌

### Pro Plan
- Connections: 10
- Queries: Unlimited
- History: 90 days
- File Size: 50MB
- Export: ✅
- AI Insights: ✅
- Team: ❌
- API Access: ❌

### Business Plan
- Connections: Unlimited
- Queries: Unlimited
- History: Unlimited
- File Size: Unlimited
- Export: ✅
- AI Insights: ✅
- Team: ✅ (5 members)
- API Access: ✅
- Scheduled Reports: ✅ (coming soon)
- Custom Dashboards: ✅ (coming soon)

---

## Testing Plan Upgrades

### Upgrade to Pro Plan
```bash
curl -X POST "http://127.0.0.1:8888/subscription/upgrade" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"plan": "pro", "trial_days": 14}'
```

### Upgrade to Business Plan
```bash
curl -X POST "http://127.0.0.1:8888/subscription/upgrade" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"plan": "business", "trial_days": 14}'
```

---

## Frontend Integration

### Plan Information Display
- Show current plan in Dashboard
- Display plan limits and usage
- Show upgrade prompts when limits reached

### Feature Gating
- Disable export buttons for Free users
- Hide AI insights for Free users
- Hide team collaboration for non-Business users
- Hide API keys for non-Business users

### Upgrade Flow
- Redirect to pricing page
- Show plan comparison
- Highlight premium features

---

## Database Migration

### Run Migration
```bash
cd backend
python migrate_add_subscription.py
```

### What It Does
1. Adds `plan` column to users table
2. Adds `subscription_expires_at` column to users table
3. Creates `team_members` table
4. Creates `scheduled_reports` table
5. Creates `api_keys` table

---

## Next Steps

### Immediate
1. ✅ Run database migration
2. ✅ Test plan limits enforcement
3. ✅ Test export functionality
4. ✅ Test AI insights
5. ⏳ Update frontend to show plan information
6. ⏳ Add upgrade/downgrade UI
7. ⏳ Implement scheduled reports
8. ⏳ Implement custom dashboards

### Future Enhancements
1. Payment integration (Stripe, PayPal)
2. Email notifications for team invitations
3. Advanced AI insights with ML models
4. Real-time collaboration features
5. White-label options for Business plan
6. Advanced analytics and reporting

---

## Notes

- All plan limits are enforced at the backend level
- Frontend should also check plan limits for better UX
- Trial periods can be set when upgrading plans
- API keys are securely generated and stored
- Team collaboration is limited to Business plan users
- Export and AI insights are available for Pro and Business plans

---

## Support

For questions or issues related to premium features, please refer to:
- API Documentation: `http://127.0.0.1:8888/docs`
- Plan Limits: `backend/plan_limits.py`
- Subscription Router: `backend/routers/subscription.py`

