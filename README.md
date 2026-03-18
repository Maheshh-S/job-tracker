# 🚀 Job Application Tracker

A full-stack Job Application Tracker built with a focus on **backend
architecture, authentication, and real-world system design**.

This project is not just a CRUD app --- it is designed to simulate how a
real production system handles **user isolation, authentication, token
lifecycle, and state consistency**.

------------------------------------------------------------------------

## 🔗 Live Links

-   Frontend: https://job-tracker-task.netlify.app/
-   Backend API: https://job-tracker-backend-58pv.onrender.com/
-   Repository: https://github.com/Maheshh-S/job-tracker

------------------------------------------------------------------------

## 🧠 What This Project Solves

Managing job applications manually is messy and inconsistent.\
This system provides:

-   Centralized tracking of applications
-   Status transitions (Applied → Interviewing → Offer → Rejected)
-   Secure user-specific data
-   Persistent storage with a real database
-   Scalable backend architecture

------------------------------------------------------------------------

## 🏗️ Architecture Overview

### Backend (Primary Focus)

-   Node.js + Express
-   MongoDB + Mongoose
-   JWT Authentication (Access + Refresh Token)
-   REST API design
-   Middleware-based request protection

### Frontend

-   React (Vite + TypeScript)
-   Tailwind CSS
-   API integration with Axios
-   Token handling + refresh flow
-   Optimistic UI updates

------------------------------------------------------------------------

## 🔐 Authentication Flow (Core Strength)

This system uses **Access + Refresh Token strategy**:

1.  User logs in → receives:

    -   Access Token (short-lived)
    -   Refresh Token (long-lived)

2.  Access token used for API calls

3.  On expiration:

    -   Axios interceptor triggers refresh
    -   New access token issued
    -   Request retried automatically

4.  If refresh fails:

    -   User is logged out

👉 This mimics real production systems.

------------------------------------------------------------------------

## 📦 Backend Design

### Folder Structure

```
└── 📁job-tracker
    └── 📁backend                      # Express.js API server
        └── 📁src
            └── 📁config
                ├── db.ts              # MongoDB connection
            └── 📁controllers
                ├── applicationController.ts  # GET/POST/PUT/DELETE for job apps
                ├── authController.ts         # Signup/login logic & token handling
            └── 📁middleware
                ├── authMiddleware.ts  # Verifies JWT tokens for protected routes
            └── 📁models
                ├── Application.ts     # Schema for job applications (company, role, status)
                ├── User.ts            # Schema for users (email, hashed password)
            └── 📁routes
                ├── applicationRoutes.ts  # /api/applications endpoints
                ├── authRoutes.ts         # /api/auth endpoints (signup, login, refresh)
                ├── testRoutes.ts         # Test routes (dev only)
            └── 📁utils
                ├── generateToken.ts   # Creates JWT access & refresh tokens
            ├── app.ts                 # Express setup, middleware, route mounting
            ├── server.ts              # Starts server on configured port
        ├── .env                       # PORT, MONGO_URI, JWT secrets
        ├── package.json                # Backend dependencies
        ├── tsconfig.json               # TypeScript config
    
    └── 📁frontend                     # React + Vite app
        └── 📁public
            ├── _redirects               # SPA fallback for hosting
        └── 📁src
            └── 📁components
                ├── AddApplicationModal.tsx   # Form popup for new/edit applications
                ├── AnimatedCard.tsx          # Reusable card with hover animations
                ├── KanbanColumn.tsx          # Drag-drop column (Applied/Interviewing/etc)
                ├── Layout.tsx                # Page wrapper with header & background
                ├── ProtectedRoute.tsx        # Blocks unauthenticated users
            └── 📁pages
                ├── Dashboard.tsx          # Main Kanban board with stats & filters
                ├── Login.tsx               # Email/password login form
                ├── Signup.tsx              # New user registration
            └── 📁services
                ├── applicationService.ts   # API functions for job apps (get/add/update/delete)
                ├── authService.ts          # Login/signup API + auto token refresh
            └── 📁types
                ├── index.ts                 # TypeScript types (Application, Status)
            ├── App.tsx                     # Routes setup (login/signup/dashboard)
            ├── index.css                    # Tailwind + custom animations
            ├── main.tsx                      # React render with toast notifications
        ├── .gitignore                      # node_modules, dist, env
        ├── eslint.config.js                 # Linting rules
        ├── index.html                       # Vite entry point
        ├── package.json                      # Frontend dependencies
        ├── tsconfig.json                     # TypeScript config
        ├── vite.config.ts                    # Vite dev server & build settings
    ├── .gitignore                          # node_modules, dist, .env
    └── README.md                            # Project overview & setup guide
```
------------------------------------------------------------------------

### Key Features

-   User-based data isolation
-   Secure password hashing (bcrypt)
-   Route protection middleware
-   Structured error handling
-   Clean separation of concerns

------------------------------------------------------------------------

### API Endpoints

#### Auth

-   POST /api/auth/signup
-   POST /api/auth/login
-   POST /api/auth/refresh

#### Applications

-   GET /api/applications
-   POST /api/applications
-   PUT /api/applications/:id/status
-   DELETE /api/applications/:id

------------------------------------------------------------------------

## 🧩 Data Model

### User

-   email
-   password (hashed)

### Application

-   user (reference)
-   company
-   role
-   status
-   appliedDate
-   notes
-   timestamps

------------------------------------------------------------------------

## ⚙️ Frontend Behavior

-   Protected routes using token validation
-   Axios interceptor handles token refresh
-   Optimistic UI updates for better UX
-   Real-time UI consistency without reload

------------------------------------------------------------------------

## 🚨 Key Engineering Decisions

### 1. Access + Refresh Token (Not basic auth)

Ensures: - Security - Scalability - Session management

------------------------------------------------------------------------

### 2. Optimistic UI Updates

-   Instant UI response
-   No waiting for API
-   Rollback on failure

------------------------------------------------------------------------

### 3. User Isolation at Query Level

Every DB operation includes: user: req.userId

Prevents: - Data leakage - Unauthorized access

------------------------------------------------------------------------

### 4. Middleware-driven Architecture

-   Clean separation
-   Reusable logic
-   Scalable codebase

------------------------------------------------------------------------

## 🧪 Testing Strategy

Manual testing done via:

-   Postman (API testing)
-   Browser DevTools (Network + Storage)
-   MongoDB Atlas (data verification)

------------------------------------------------------------------------

## 📈 What I Would Improve (Real Next Steps)

If extended further, I would evolve this into a more **product-oriented
system**:

-   Add follow-up reminders for applications
-   Introduce timeline-based tracking
-   Build analytics (success rate, response trends)
-   Improve workflow UX (Kanban-level interaction)
-   Add notifications for status changes

The goal would be to move from a simple tracker to a **decision-support
system** for job seekers.

------------------------------------------------------------------------

## 🚀 Deployment

-   Backend: Render
-   Frontend: Netlify
-   Database: MongoDB Atlas

------------------------------------------------------------------------

## 🧠 Key Learnings

-   Handling token lifecycle correctly is non-trivial
-   State consistency is harder than API design
-   Optimistic updates require careful rollback handling
-   Backend design decisions directly impact frontend complexity

------------------------------------------------------------------------

## 📌 Final Note

This project reflects a focus on **backend reliability, authentication
correctness, and real-world system behavior**, rather than just UI
features.

It is designed to demonstrate how a full-stack system behaves under
realistic conditions.

------------------------------------------------------------------------
