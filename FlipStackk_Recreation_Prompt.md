# FlipStackk - Complete Application Recreation Prompt

## Project Overview
Create a comprehensive real estate deal management platform called "FlipStackk" - a specialized business and operational platform for real estate investment activities. This application should include AI-powered lead scoring, a built-in buyer marketplace for contract assignments, deal pipelines for various real estate types, and gamification features for team performance tracking.

## Technology Stack Options
Choose ONE of the following technology stacks:

### Option A: Basic Web Technologies
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **Database**: SQLite or PostgreSQL
- **Authentication**: Session-based with bcrypt
- **Real-time**: WebSockets for live updates

### Option B: Next.js Full-Stack
- **Framework**: Next.js 14+ with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Real-time**: Socket.io or WebSockets
- **State Management**: React Query/TanStack Query

## Core Features & Functionality

### 1. Authentication System
- **Multi-role authentication** with roles: Admin, Acquisitions, Caller, Investor
- **Secure login/logout** with session management
- **User registration** with role assignment
- **Protected routes** based on user roles
- **Demo credentials**: username: "demo", password: "password"

### 2. Dashboard (Home Page)
- **Performance metrics overview**: Total calls, leads converted, revenue generated
- **Recent activity feed** with real-time updates
- **Quick action buttons**: Add lead, schedule call, view analytics
- **Motivational banner** with inspiring quotes for real estate teams
- **Upcoming scheduled calls** widget
- **Lead status distribution** charts
- **Team performance** summary cards

### 3. Lead Management System
- **Complete CRUD operations** for leads
- **Lead properties**:
  - Unique Lead ID format: LD-YYYY-XXXX (e.g., LD-2025-0001)
  - Property address, city, state, ZIP
  - Owner name, phone, email
  - Status: new, contacted, follow-up, negotiation, under-contract, closed, dead
  - Motivation level: unknown, low, medium, high
  - Property type: single-family, multi-family, condo, commercial, land
  - Lead source: cold-call, direct-mail, referral, online, other
  - Financial data: ARV (After Repair Value), repair costs, estimated value
  - Assigned team member
  - Latitude/longitude for mapping
  - Notes and timestamps

- **Advanced filtering and search**:
  - Filter by status, property type, assigned user, date range
  - Search by property address, owner name, or lead ID
  - Sorting options by date, value, status

- **CSV Import functionality**:
  - Upload CSV files with lead data
  - Automatic data validation and duplicate detection
  - Progress tracking during import
  - Error handling for invalid data

### 4. Call Management & Tracking
- **Call logging system**:
  - Log calls made to leads
  - Track duration, outcome (answered, voicemail, no-answer)
  - Add detailed notes
  - Timestamp tracking

- **Scheduled calls management**:
  - Schedule future calls with specific team members
  - Calendar view of upcoming calls
  - Call assignment to team members
  - Status tracking: pending, completed, missed
  - Email/notification reminders

- **Twilio integration** (if available):
  - Built-in dialer for making calls directly from the app
  - Call recording capabilities
  - Automatic call logging

### 5. Team Management
- **Team member profiles** with performance statistics:
  - Total calls made
  - Leads converted
  - Revenue generated
  - Current deals value
  - Last activity timestamp

- **User management** (Admin only):
  - Add/remove team members
  - Assign roles and permissions
  - View team performance metrics

### 6. Analytics & Reporting
- **Performance dashboards**:
  - Call volume trends
  - Conversion rate analytics
  - Revenue tracking
  - Lead source effectiveness
  - Team performance comparisons

- **Visual charts and graphs**:
  - Bar charts for monthly performance
  - Line graphs for trend analysis
  - Pie charts for lead distribution
  - Conversion funnel visualization

### 7. Interactive Map View
- **Property location mapping**:
  - Display all leads on an interactive map
  - Filter properties by status, type, value
  - Cluster markers for better visualization
  - Property details popup on marker click
  - Integration with mapping service (Google Maps, Leaflet, etc.)

### 8. Deal Calculator
- **Real estate calculation tools**:
  - ARV calculator
  - Repair cost estimator
  - Profit margin calculator
  - ROI analysis tools
  - Flip vs. hold analysis

### 9. Timesheet Management
- **Time tracking for team members**:
  - Clock in/out functionality
  - Daily, weekly, monthly time reports
  - Activity categorization
  - Approval workflow for timesheets
  - Export capabilities for payroll

### 10. Activity Tracking
- **Real-time activity feed**:
  - Lead creation/updates
  - Call completions
  - Deal status changes
  - Team member actions
  - System notifications

### 11. Settings & Configuration
- **User profile management**:
  - Update personal information
  - Change passwords
  - Notification preferences
  - Theme selection (light/dark mode)

- **System settings** (Admin only):
  - Lead sources configuration
  - Status definitions
  - Team roles and permissions
  - Integration settings

## Database Schema

### Users Table
```sql
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- name
- role (admin, acquisitions, caller, investor)
- created_at
- updated_at
```

### Leads Table
```sql
- id (Primary Key)
- lead_id (Custom format: LD-YYYY-XXXX)
- property_address
- city
- state
- zip
- owner_name
- owner_phone
- owner_email
- status
- motivation_level
- property_type
- lead_source
- notes
- arv (After Repair Value)
- repair_cost
- estimated_value
- assigned_to_user_id (Foreign Key)
- latitude
- longitude
- created_at
- updated_at
```

### Calls Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- lead_id (Foreign Key)
- call_timestamp
- duration_seconds
- outcome
- notes
- created_at
```

### Scheduled Calls Table
```sql
- id (Primary Key)
- assigned_caller_id (Foreign Key)
- lead_id (Foreign Key)
- scheduled_time
- notes
- status (pending, completed, missed)
- created_at
- updated_at
```

### Team Members Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- total_calls
- total_leads_converted
- total_revenue_generated
- current_deals_value
- last_activity_at
- created_at
- updated_at
```

### Activities Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- action_type
- description
- metadata (JSON)
- created_at
```

### Timesheets Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- date
- clock_in_time
- clock_out_time
- total_hours
- description
- approved
- approved_by_user_id
- created_at
- updated_at
```

## UI/UX Design Requirements

### Design System
- **Color Scheme**: Professional dark/light theme support
- **Typography**: Clean, readable fonts (Inter, Open Sans, or similar)
- **Layout**: Responsive grid-based design for mobile, tablet, desktop
- **Navigation**: Sidebar navigation with collapsible menu
- **Icons**: Consistent icon set (Lucide React, Heroicons, or similar)

### Component Library
- **Forms**: Validation, error handling, success states
- **Tables**: Sortable columns, pagination, filtering
- **Modals**: Create/edit forms, confirmations, detailed views
- **Charts**: Bar, line, pie charts for analytics
- **Maps**: Interactive property location display
- **Calendar**: Scheduled calls and timesheet views
- **Cards**: Metric displays, lead summaries
- **Buttons**: Primary, secondary, danger, success variants
- **Badges**: Status indicators, role badges
- **Alerts**: Success, error, warning, info notifications

### Responsive Design
- **Mobile**: Touch-friendly interface, collapsible navigation
- **Tablet**: Optimized layouts for medium screens
- **Desktop**: Full-featured interface with sidebar navigation

## Authentication & Security
- **Password hashing**: bcrypt or similar
- **Session management**: Secure session handling
- **Role-based access control**: Protect routes based on user roles
- **Input validation**: Client and server-side validation
- **CSRF protection**: Cross-site request forgery prevention
- **Rate limiting**: API endpoint protection

## Real-time Features
- **WebSocket integration**: Live updates for activities
- **Notifications**: Real-time alerts for new leads, calls
- **Team collaboration**: Live activity feed
- **Status updates**: Real-time lead status changes

## Sample Data
Include the following sample users for testing:
- **Admin**: username: "admin", role: "admin"
- **Demo User**: username: "demo", password: "password", role: "caller"
- **Benny Jelleh**: username: "benjistackk", role: "acquisitions"
- **Kevin Ben**: username: "KevinBen", role: "admin"
- **Ibby Keita**: username: "IbbyKeita1", role: "caller"
- **Michael Ramos**: username: "Mike", role: "caller"
- **Joefrence Peña**: username: "joefrencep", role: "caller"

## Error Handling & Recovery
- **Comprehensive error boundaries**: Catch and display user-friendly errors
- **Form validation**: Real-time validation with helpful messages
- **API error handling**: Graceful handling of network issues
- **Loading states**: Skeleton screens and loading indicators
- **Retry mechanisms**: Automatic retry for failed requests

## Performance Requirements
- **Fast loading times**: Optimize images, lazy loading
- **Efficient data fetching**: Pagination, caching
- **Mobile optimization**: Touch gestures, responsive design
- **SEO friendly**: Proper meta tags, semantic HTML

## Additional Features
- **Data export**: Export leads, calls, analytics to CSV/Excel
- **Search functionality**: Global search across leads and activities
- **Bulk operations**: Bulk update lead statuses, assignments
- **Audit logging**: Track all user actions for compliance
- **Backup/restore**: Data backup and recovery procedures

## Implementation Priority
1. **Phase 1**: Authentication, basic CRUD for leads, dashboard
2. **Phase 2**: Call management, team functionality, basic analytics
3. **Phase 3**: Advanced features (mapping, calculator, timesheets)
4. **Phase 4**: Real-time features, advanced analytics, mobile optimization

## Success Criteria
- All CRUD operations working for leads and calls
- User authentication with role-based access
- Responsive design across all devices
- Real-time updates for team collaboration
- Comprehensive error handling and user feedback
- Professional, intuitive user interface
- Performance optimized for real-world usage

## Notes
- Focus on clean, maintainable code architecture
- Implement proper error handling throughout
- Ensure data integrity and validation
- Design for scalability and future enhancements
- Include comprehensive documentation and comments
- Test thoroughly across different user roles and scenarios

This application should serve as a complete real estate deal management platform that real estate investment teams can use to track leads, manage calls, analyze performance, and collaborate effectively.