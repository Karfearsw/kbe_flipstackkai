# Overview

FlipStackk is a comprehensive real estate deal management platform designed for real estate investors, wholesalers, and teams. The application provides tools for lead tracking, call management, deal pipeline visualization, team performance monitoring, and real estate investment calculations. It serves multiple user roles including admins, acquisitions teams, callers, and investors with role-based access control.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas
- **Real-time Updates**: WebSocket integration for live notifications

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy and session-based auth
- **Password Security**: bcrypt for hashing with development bypass for testing
- **Session Storage**: PostgreSQL-backed session store
- **API Design**: RESTful endpoints with consistent error handling
- **Real-time Communication**: WebSocket server for live updates and notifications

## Database Design
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Key Tables**: Users, Leads, Calls, ScheduledCalls, Activities, Timesheets
- **Relationships**: Explicit foreign key relationships with proper indexing

## Authentication & Authorization
- **Multi-role System**: Admin, Acquisitions, Caller, Investor roles
- **Session Management**: Express-session with PostgreSQL store
- **Protected Routes**: Role-based access control with React route guards
- **Development Access**: Demo credentials (username: "demo", password: "password")

## Real-time Features
- **WebSocket Server**: Custom WebSocket implementation for live updates
- **Event Broadcasting**: Activity feeds, lead updates, call notifications
- **Client Synchronization**: Automatic cache invalidation and data refreshing

## Lead Management System
- **Unique Lead IDs**: Custom format (LD-YYYY-XXXX) with year-based organization
- **Status Pipeline**: Comprehensive lead lifecycle tracking (new → contacted → negotiation → closed)
- **Geographic Features**: Latitude/longitude storage for mapping capabilities
- **Assignment System**: Lead distribution among team members

## Call Tracking & Communication
- **Twilio Integration**: Voice calling capabilities with access token generation
- **Call Logging**: Automatic call history with duration and outcome tracking
- **Scheduled Calls**: Calendar-based call scheduling system
- **Call Analytics**: Performance metrics and conversion tracking

# External Dependencies

## Database & Hosting
- **Neon Database**: Serverless PostgreSQL hosting for production data
- **Replit Deployment**: Integrated hosting and development environment

## Communication Services
- **Twilio Voice API**: Outbound calling capabilities and call management
- **WebSocket Protocol**: Real-time bidirectional communication

## UI & Design Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent visual elements
- **Recharts**: Data visualization for analytics and performance charts

## Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition

## Mapping & Visualization
- **Leaflet**: Interactive maps for property location visualization
- **FullCalendar**: Calendar components for scheduling interfaces

## File Processing
- **Papa Parse**: CSV import/export functionality for bulk lead management