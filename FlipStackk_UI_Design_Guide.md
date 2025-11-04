# FlipStackk UI/UX Design Specification & Templates

## Design System Overview

### Brand Identity
- **Primary Color**: #1e40af (Professional Blue)
- **Secondary Color**: #059669 (Success Green)  
- **Accent Color**: #dc2626 (Alert Red)
- **Background**: #f8fafc (Light Gray)
- **Dark Mode**: #0f172a (Dark Blue-Gray)

### Typography
- **Primary Font**: Inter (Clean, modern, excellent readability)
- **Secondary Font**: System UI fallback
- **Heading Weights**: 600-700 (Semibold to Bold)
- **Body Text**: 400-500 (Regular to Medium)

### Spacing System
- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- **Container Max Width**: 1280px
- **Content Padding**: 16px mobile, 24px tablet, 32px desktop

## Layout Architecture

### 1. Desktop Layout (1024px+)
```
┌─────────────────────────────────────────────────────────┐
│ Header Bar (64px height)                               │
│ Logo | Navigation | User Profile | Theme Toggle       │
├─────────────────────────────────────────────────────────┤
│ Sidebar (240px) │ Main Content Area                    │
│                 │                                      │
│ Navigation      │ Page Header (80px)                   │
│ - Dashboard     │ Title | Breadcrumbs | Actions        │
│ - Leads         │                                      │
│ - Calls         │ Content Area                         │
│ - Team          │ Cards/Tables/Forms                   │
│ - Analytics     │                                      │
│ - Map           │                                      │
│ - Calculator    │                                      │
│ - Timesheet     │                                      │
│ - Activities    │                                      │
│ - Settings      │                                      │
│                 │                                      │
│ User Profile    │                                      │
│ Theme Toggle    │                                      │
└─────────────────┴──────────────────────────────────────┘
```

### 2. Tablet Layout (768px - 1023px)
```
┌─────────────────────────────────────────────────────────┐
│ Header Bar (56px height)                               │
│ ☰ Menu | Logo | User Profile                          │
├─────────────────────────────────────────────────────────┤
│ Collapsible Sidebar │ Main Content                     │
│ (Overlay on mobile) │                                  │
│                     │ Responsive grid layout           │
│                     │ 2-column cards                   │
│                     │ Horizontal scroll tables         │
└─────────────────────┴──────────────────────────────────┘
```

### 3. Mobile Layout (320px - 767px)
```
┌─────────────────────────────────────┐
│ Header Bar (48px height)           │
│ ☰ | Logo | Profile                 │
├─────────────────────────────────────┤
│ Main Content                        │
│ Single column layout                │
│ Stacked cards                       │
│ Full-width components               │
│                                     │
├─────────────────────────────────────┤
│ Bottom Navigation (60px)            │
│ Dashboard | Leads | Calls | More    │
└─────────────────────────────────────┘
```

## Component Library

### 1. Authentication Components

#### Login Screen Template
```jsx
// Modern gradient background with floating form
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
  <div className="max-w-md w-full">
    <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">
      {/* Logo */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">FlipStackk</h1>
        <p className="text-gray-600 mt-2">Real Estate Deal Management</p>
      </div>
      
      {/* Login Form */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input 
            type="text" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter password"
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Sign In
        </button>
      </form>
      
      {/* Demo Credentials */}
      <div className="bg-gray-50 rounded-lg p-3 text-sm">
        <p className="font-medium text-gray-700">Demo Access:</p>
        <p className="text-gray-600">Username: demo | Password: password</p>
      </div>
    </div>
  </div>
</div>
```

### 2. Navigation Components

#### Sidebar Navigation
```jsx
<aside className="w-64 bg-white border-r border-gray-200 h-full">
  <div className="p-6">
    <h1 className="text-xl font-bold text-gray-900">FlipStackk</h1>
  </div>
  
  <nav className="mt-6">
    {[
      { name: 'Dashboard', icon: '📊', href: '/', active: true },
      { name: 'Leads', icon: '🎯', href: '/leads', count: 24 },
      { name: 'Calls', icon: '📞', href: '/calls', count: 12 },
      { name: 'Team', icon: '👥', href: '/team' },
      { name: 'Analytics', icon: '📈', href: '/analytics' },
      { name: 'Map View', icon: '🗺️', href: '/map' },
      { name: 'Calculator', icon: '🧮', href: '/calculator' },
      { name: 'Timesheet', icon: '⏰', href: '/timesheet' },
      { name: 'Activities', icon: '📋', href: '/activities' }
    ].map((item) => (
      <a 
        key={item.name}
        href={item.href}
        className={`flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors ${
          item.active 
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <div className="flex items-center">
          <span className="mr-3">{item.icon}</span>
          {item.name}
        </div>
        {item.count && (
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
            {item.count}
          </span>
        )}
      </a>
    ))}
  </nav>
</aside>
```

#### Mobile Bottom Navigation
```jsx
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
  <div className="flex justify-around">
    {[
      { name: 'Dashboard', icon: '📊', href: '/' },
      { name: 'Leads', icon: '🎯', href: '/leads' },
      { name: 'Calls', icon: '📞', href: '/calls' },
      { name: 'More', icon: '⋯', href: '/menu' }
    ].map((item) => (
      <a 
        key={item.name}
        href={item.href}
        className="flex flex-col items-center py-2 px-3 text-xs font-medium text-gray-600"
      >
        <span className="text-lg mb-1">{item.icon}</span>
        {item.name}
      </a>
    ))}
  </div>
</nav>
```

### 3. Dashboard Components

#### Metric Cards
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  {[
    { title: 'Total Leads', value: '1,247', change: '+12%', trend: 'up', icon: '🎯' },
    { title: 'Calls Made', value: '856', change: '+8%', trend: 'up', icon: '📞' },
    { title: 'Deals Closed', value: '34', change: '+15%', trend: 'up', icon: '✅' },
    { title: 'Revenue', value: '$485K', change: '+22%', trend: 'up', icon: '💰' }
  ].map((metric) => (
    <div key={metric.title} className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
        </div>
        <div className="text-2xl">{metric.icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        <span className="text-sm text-green-600 font-medium">{metric.change}</span>
        <span className="text-sm text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  ))}
</div>
```

#### Recent Activity Feed
```jsx
<div className="bg-white rounded-lg border border-gray-200">
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
  </div>
  <div className="divide-y divide-gray-200">
    {[
      { user: 'John Doe', action: 'added new lead', target: 'LD-2025-0234', time: '2 min ago', avatar: '👤' },
      { user: 'Sarah Wilson', action: 'completed call with', target: 'Mike Johnson', time: '15 min ago', avatar: '👩' },
      { user: 'Alex Brown', action: 'updated deal status', target: 'Under Contract', time: '1 hour ago', avatar: '👨' }
    ].map((activity, index) => (
      <div key={index} className="px-6 py-4 flex items-center space-x-4">
        <div className="text-2xl">{activity.avatar}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">
            <span className="font-medium">{activity.user}</span>
            {' '}{activity.action}{' '}
            <span className="font-medium text-blue-600">{activity.target}</span>
          </p>
          <p className="text-sm text-gray-500">{activity.time}</p>
        </div>
      </div>
    ))}
  </div>
</div>
```

### 4. Lead Management Components

#### Lead Card Template
```jsx
<div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-mono text-gray-500">LD-2025-0234</span>
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Hot Lead
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mt-2">
        123 Main Street, Dallas, TX 75201
      </h3>
      
      <div className="mt-3 space-y-1">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Owner:</span> John Smith
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phone:</span> (555) 123-4567
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">ARV:</span> $325,000
        </p>
      </div>
    </div>
    
    <div className="flex flex-col items-end space-y-2">
      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
        📞
      </button>
      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-md">
        ✏️
      </button>
    </div>
  </div>
  
  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
    <span className="text-xs text-gray-500">Last contacted: 2 days ago</span>
    <span className="text-xs text-gray-500">Assigned to: Mike Johnson</span>
  </div>
</div>
```

#### Lead Table View
```jsx
<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">All Leads</h3>
      <div className="flex items-center space-x-3">
        <input 
          type="search" 
          placeholder="Search leads..."
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>All Status</option>
          <option>New</option>
          <option>Contacted</option>
          <option>Negotiation</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
          + Add Lead
        </button>
      </div>
    </div>
  </div>
  
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Lead ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Property Address
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Owner
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ARV
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {/* Table rows would be mapped here */}
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
            LD-2025-0234
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            123 Main Street, Dallas, TX
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            John Smith
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
              Hot Lead
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            $325,000
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-900">📞</button>
              <button className="text-gray-600 hover:text-gray-900">✏️</button>
              <button className="text-red-600 hover:text-red-900">🗑️</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### 5. Call Management Components

#### Call Dialer Interface
```jsx
<div className="bg-white rounded-lg border border-gray-200 p-6 max-w-sm mx-auto">
  <div className="text-center">
    <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
      <span className="text-2xl">👤</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-900">John Smith</h3>
    <p className="text-sm text-gray-600">(555) 123-4567</p>
    <p className="text-xs text-gray-500 mt-1">LD-2025-0234</p>
  </div>
  
  <div className="mt-6 grid grid-cols-3 gap-3">
    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
      <button 
        key={digit}
        className="h-12 w-12 rounded-full bg-gray-100 hover:bg-gray-200 text-lg font-semibold text-gray-900 transition-colors"
      >
        {digit}
      </button>
    ))}
  </div>
  
  <div className="mt-6 flex justify-center space-x-4">
    <button className="w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center text-2xl">
      📞
    </button>
    <button className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-2xl">
      ❌
    </button>
  </div>
</div>
```

#### Call Log Entry
```jsx
<div className="bg-white rounded-lg border border-gray-200 p-4">
  <div className="flex items-start space-x-4">
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <span className="text-blue-600 text-lg">📞</span>
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">John Smith</h4>
        <span className="text-xs text-gray-500">2 hours ago</span>
      </div>
      
      <p className="text-sm text-gray-600 mt-1">(555) 123-4567 • LD-2025-0234</p>
      
      <div className="mt-2 flex items-center space-x-4">
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Answered
        </span>
        <span className="text-xs text-gray-500">Duration: 8:32</span>
      </div>
      
      <p className="text-sm text-gray-700 mt-3">
        Discussed property condition and seller motivation. Very interested in quick sale. Scheduled follow-up for tomorrow.
      </p>
    </div>
  </div>
</div>
```

### 6. Form Components

#### Create Lead Form
```jsx
<form className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
  <div className="border-b border-gray-200 pb-4">
    <h3 className="text-lg font-semibold text-gray-900">Add New Lead</h3>
    <p className="text-sm text-gray-600 mt-1">Enter property and owner information</p>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Property Address *
      </label>
      <input 
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="123 Main Street"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        City *
      </label>
      <input 
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Dallas"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        State *
      </label>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <option>Select State</option>
        <option>TX</option>
        <option>CA</option>
        <option>NY</option>
      </select>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        ZIP Code *
      </label>
      <input 
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="75201"
      />
    </div>
  </div>
  
  <div className="border-t border-gray-200 pt-6">
    <h4 className="text-base font-medium text-gray-900 mb-4">Owner Information</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Owner Name *
        </label>
        <input 
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="John Smith"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input 
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="(555) 123-4567"
        />
      </div>
    </div>
  </div>
  
  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
    <button 
      type="button"
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
    >
      Cancel
    </button>
    <button 
      type="submit"
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
    >
      Create Lead
    </button>
  </div>
</form>
```

## Visual Design Patterns

### 1. Color Usage
- **Primary Blue (#1e40af)**: CTA buttons, active states, links
- **Success Green (#059669)**: Positive metrics, success messages
- **Warning Orange (#ea580c)**: Caution states, pending items
- **Error Red (#dc2626)**: Error states, delete actions
- **Gray Scale**: Text hierarchy, borders, backgrounds

### 2. Status Indicators
```jsx
// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    'new': 'bg-blue-100 text-blue-800',
    'contacted': 'bg-yellow-100 text-yellow-800',
    'negotiation': 'bg-orange-100 text-orange-800',
    'under-contract': 'bg-purple-100 text-purple-800',
    'closed': 'bg-green-100 text-green-800',
    'dead': 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
```

### 3. Interactive States
- **Hover**: Subtle elevation with shadow-md
- **Active**: Pressed state with shadow-inner
- **Focus**: Ring outline with brand color
- **Disabled**: Reduced opacity and cursor-not-allowed

### 4. Loading States
```jsx
// Skeleton Loading Component
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
</div>
```

## Responsive Breakpoints

### Mobile First Approach
```css
/* Mobile (default) */
.container { padding: 16px; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 24px; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 32px; }
  .grid { grid-template-columns: repeat(4, 1fr); }
  .sidebar { display: block; }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .container { max-width: 1280px; margin: 0 auto; }
}
```

## Performance Considerations

### 1. Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading for images
- Compress and resize appropriately

### 2. Component Optimization
- Implement virtual scrolling for large lists
- Use React.memo for expensive components
- Lazy load heavy components

### 3. Loading Optimization
- Show skeleton screens during data loading
- Implement progressive loading for tables
- Use optimistic UI updates

## Accessibility Features

### 1. Keyboard Navigation
- Tab order follows logical flow
- All interactive elements accessible via keyboard
- Clear focus indicators

### 2. Screen Reader Support
- Semantic HTML structure
- Proper ARIA labels and roles
- Alt text for images and icons

### 3. Color Accessibility
- WCAG AA compliant color contrast
- Not relying solely on color for information
- High contrast mode support

This comprehensive UI design guide provides the foundation for creating a professional, accessible, and user-friendly FlipStackk application that works seamlessly across all devices and platforms.