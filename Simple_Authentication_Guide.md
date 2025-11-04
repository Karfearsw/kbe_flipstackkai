# Simple Authentication Implementation Guide for Building FlipStackk Outside Replit

## Overview
This guide provides the simplest authentication implementations for recreating FlipStackk using different technology stacks.

## Option 1: Basic HTML/CSS/JavaScript with Express.js Backend

### Backend (Node.js + Express)
```javascript
// server.js
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Simple in-memory user storage (replace with database)
const users = [
  { id: 1, username: 'demo', password: '$2b$10$simple', name: 'Demo User', role: 'caller' },
  { id: 2, username: 'admin', password: '$2b$10$simple', name: 'Admin User', role: 'admin' }
];

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: 'flipstackk-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}

// Routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // For demo purposes - accept "password" for all users
  if (password === 'password') {
    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.json({ id: user.id, username: user.username, role: user.role });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Serve main app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Frontend (HTML/CSS/JavaScript)
```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlipStackk</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 400px; margin: 100px auto; padding: 20px; }
        .auth-card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .error { color: red; margin-top: 10px; }
        .dashboard { padding: 20px; }
        .nav { background: #343a40; color: white; padding: 15px; margin-bottom: 20px; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <!-- Login Form -->
    <div id="loginForm" class="container">
        <div class="auth-card">
            <h2>FlipStackk Login</h2>
            <form id="login">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" value="demo" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" value="password" required>
                </div>
                <button type="submit">Login</button>
                <div id="error" class="error"></div>
            </form>
        </div>
    </div>

    <!-- Dashboard -->
    <div id="dashboard" class="hidden">
        <nav class="nav">
            <span>FlipStackk - Welcome <span id="userName"></span></span>
            <button onclick="logout()" style="float: right;">Logout</button>
        </nav>
        <div class="dashboard">
            <h1>Dashboard</h1>
            <p>Welcome to FlipStackk Real Estate Management</p>
            <!-- Add your dashboard content here -->
        </div>
    </div>

    <script>
        let currentUser = null;

        // Check if user is already logged in
        fetch('/api/user')
            .then(res => res.json())
            .then(user => {
                if (user.id) {
                    showDashboard(user);
                }
            })
            .catch(() => {
                // User not logged in, show login form
            });

        // Login form submission
        document.getElementById('login').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                if (response.ok) {
                    const user = await response.json();
                    showDashboard(user);
                } else {
                    const error = await response.json();
                    document.getElementById('error').textContent = error.error;
                }
            } catch (err) {
                document.getElementById('error').textContent = 'Login failed';
            }
        });

        function showDashboard(user) {
            currentUser = user;
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            document.getElementById('userName').textContent = user.username;
        }

        async function logout() {
            await fetch('/api/logout', { method: 'POST' });
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('dashboard').classList.add('hidden');
            currentUser = null;
        }
    </script>
</body>
</html>
```

## Option 2: Next.js with NextAuth.js (Simplest Modern Approach)

### Installation
```bash
npm install next-auth
```

### Environment Variables (.env.local)
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Auth Configuration
```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Simple user database (replace with real database)
const users = [
  { id: 1, username: 'demo', password: 'password', name: 'Demo User', role: 'caller' },
  { id: 2, username: 'admin', password: 'password', name: 'Admin User', role: 'admin' }
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = users.find(u => 
          u.username === credentials.username && 
          u.password === credentials.password
        );
        
        if (user) {
          return { id: user.id, name: user.name, username: user.username, role: user.role };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.username = token.username;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
});
```

### Login Page
```jsx
// pages/auth/signin.js
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function SignIn() {
  const [credentials, setCredentials] = useState({ username: 'demo', password: 'password' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await signIn('credentials', {
      username: credentials.username,
      password: credentials.password,
      redirect: false
    });

    if (result.ok) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            FlipStackk Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="relative block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          
          {error && <div className="text-red-600 text-sm">{error}</div>}
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Protected Dashboard
```jsx
// pages/dashboard.js
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) router.push('/auth/signin'); // Not logged in
  }, [session, status, router]);

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Access Denied</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">FlipStackk</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-4">Welcome to FlipStackk Real Estate Management</p>
          <div className="mt-8">
            <p>User Role: {session.user.role}</p>
            <p>Username: {session.user.username}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

### App Component
```jsx
// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

## Option 3: Simple JWT-based Authentication (Most Flexible)

### Backend (Express + JWT)
```javascript
// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const JWT_SECRET = 'your-jwt-secret';

// Simple user storage
const users = [
  { id: 1, username: 'demo', password: 'password', name: 'Demo User', role: 'caller' },
  { id: 2, username: 'admin', password: 'password', name: 'Admin User', role: 'admin' }
];

app.use(express.json());

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { id: user.id, username: user.username, role: user.role, name: user.name }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/user', authenticateToken, (req, res) => {
  res.json(req.user);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Frontend (React/Vanilla JS)
```javascript
// auth.js
class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  async login(username, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      this.token = data.token;
      localStorage.setItem('token', this.token);
      return data.user;
    } else {
      throw new Error('Login failed');
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async getUser() {
    if (!this.token) return null;

    const response = await fetch('/api/user', {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });

    if (response.ok) {
      return await response.json();
    } else {
      this.logout();
      return null;
    }
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const auth = new AuthService();
```

## Key Benefits of Each Approach

### Option 1 (Express + Sessions)
- **Simplest to understand**
- **No external dependencies**
- **Built-in CSRF protection**
- **Server-side session storage**

### Option 2 (NextAuth.js)
- **Industry standard**
- **Built-in security features**
- **Easy social login integration**
- **Automatic session management**

### Option 3 (JWT)
- **Stateless authentication**
- **Mobile app friendly**
- **Scalable across servers**
- **Full control over tokens**

## Security Notes

1. **Never store passwords in plain text** - Always hash them
2. **Use HTTPS in production** - Protects tokens and sessions
3. **Set proper session timeouts** - Balance security and usability
4. **Validate all inputs** - Prevent injection attacks
5. **Use environment variables** - Keep secrets secure

## Demo Credentials for All Implementations
- **Username**: `demo` **Password**: `password`
- **Username**: `admin` **Password**: `password`

Choose the option that best fits your comfort level and project requirements. Option 2 (NextAuth.js) is recommended for most modern applications due to its security features and ease of use.