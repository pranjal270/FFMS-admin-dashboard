# 🚩 Feature Flag Management System – Admin Dashboard

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-lightgrey)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## 📌 Overview

The **Admin Dashboard** is the control center of the Feature Flag Management System. It allows administrators to manage feature flags, control feature rollouts, and monitor system activity without redeploying the application.

This system enables **safe feature releases**, gradual rollouts, and quick rollbacks in case of issues.

---

## 🎯 Problem Statement

Modern applications often need to release new features safely without impacting all users at once. Deploying unfinished features directly to production can introduce bugs and affect user experience.

Feature flags solve this problem by allowing developers and administrators to **enable or disable features dynamically without redeploying code**.

Example use cases:

- Gradual rollout of a new feature to 20% of users
- Premium users receiving special discounts
- Testing new UI features with beta testers
- Instantly disabling buggy features in production

---

## ✨ Key Features

### 🔐 Authentication System

- JWT-based authentication
- Password hashing with **bcrypt**
- Role-based access control (**RBAC**)
- Admin-only dashboard access
- Backup **security recovery codes** generated on first login

---

### 🚩 Feature Flag Management

Administrators can:

- Create feature flags
- Enable or disable flags
- Update feature configurations
- Delete feature flags
- Configure rollout percentages

---

### 🎯 Targeting Rules

Feature flags can be applied to:

- Premium users
- Beta testers
- Specific user groups
- Environment-based conditions (dev / staging / production)

---

### 📊 Audit Logging

Every feature flag modification is recorded:

- Who made the change
- What was changed
- When the change occurred

This ensures **traceability and accountability**.

---

### ⚡ Rollout Control

Supports controlled feature releases:

- Percentage-based rollout
- Deterministic evaluation
- Instant rollback capability

---

## 🧱 System Architecture
Admin Dashboard (React)
│
▼
API Requests (Axios)
│
▼
Express Backend (Node.js)
│
▼
Authentication Middleware (JWT)
│
▼
Controllers (Business Logic)
│
▼
MongoDB Database

---
First login flow:
Admin Login
↓
POST /api/auth/login
↓
Verify credentials
↓
Generate JWT token
↓
Token stored in browser
↓
Protected Admin Dashboard


First login flow:
First Login
↓
Generate Recovery Codes
↓
Display codes to user
↓
User saves them securely
↓
Access dashboard

---

## 📂 Project Structure
project-root
│
├── server
│ ├── config
│ │ db.js
│ │
│ ├── controllers
│ │ authController.js
│ │
│ ├── middleware
│ │ authMiddleware.js
│ │
│ ├── models
│ │ User.js
│ │
│ ├── routes
│ │ authRoutes.js
│ │
│ ├── utils
│ │ generateRecoveryCodes.js
│ │
│ └── server.js
│
└── client
├── pages
│ Login.jsx
│ Dashboard.jsx
│ RecoveryCodes.jsx
│
├── components
│ ProtectedRoute.jsx
│
├── services
│ api.js
│
└── App.jsx


---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcrypt

### Optional Enhancements
- Redis caching
- Docker deployment

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|------|------|------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

---

### Feature Flags

| Method | Endpoint | Description |
|------|------|------|
| GET | `/api/flags` | Retrieve all feature flags |
| POST | `/api/flags` | Create feature flag |
| PUT | `/api/flags/:id` | Update feature flag |
| DELETE | `/api/flags/:id` | Delete feature flag |

---

### Audit Logs

| Method | Endpoint | Description |
|------|------|------|
| GET | `/api/audit-logs` | Retrieve audit history |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
git clone <repository-url>

---

### 2️⃣ Backend Setup
cd server
npm install

Create a `.env` file:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run backend server:
node server.js

---

### 3️⃣ Frontend Setup
cd client
npm install
npm run dev

---

## 🔒 Security Features

- Password hashing using **bcrypt**
- JWT-based authentication
- Admin role-based access control
- Protected API routes
- One-time backup recovery codes

---

## 🚀 Future Improvements

Planned enhancements:

- Feature flag analytics dashboard
- Scheduled feature activation
- Redis caching for faster flag evaluation
- A/B testing experiments
- Feature usage metrics
- Dockerized deployment

---

## 👨‍💻 Author

**Pranjal Thange**  **Mitali Jain**
Computer Science Engineering Students

---

## 📄 License

This project is created for educational and research purposes.
