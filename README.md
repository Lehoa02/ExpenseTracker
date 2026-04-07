# 💰 ExpenseTracker

A full-stack personal finance management application that helps users track expenses, income, and recurring transactions with an AI-powered financial assistant.

## 📋 Overview

ExpenseTracker is a modern web application designed to simplify personal finance management. Users can effortlessly log expenses and income, visualize financial trends through interactive charts, set up recurring transactions, and get personalized financial insights powered by AI.

### Key Characteristics
- **Full-Stack Application**: Separate frontend and backend for scalability
- **Real-time Dashboard**: Track finances at a glance
- **Recurring Transactions**: Automate your recurring expenses and income
- **AI Assistant**: Get smart financial advice using Google's Gemini API
- **Dark/Light Theme**: User-friendly interface with theme switching
- **Secure Authentication**: JWT-based authentication with password hashing
- **Responsive Design**: Works seamlessly on desktop and mobile

---

## ✨ Features

### 1. **Authentication & User Management**
   - User registration and login
   - Secure password encryption with bcrypt
   - JWT-based session management
   - Profile photo upload and customization

### 2. **Expense Tracking**
   - Add, edit, and delete expenses with categories
   - Categorized expense view with custom emojis
   - Expense analytics and trends
   - Category-wise breakdown charts

### 3. **Income Tracking**
   - Record income from multiple sources
   - Track income with custom sources and emojis
   - Income vs. Expense comparison
   - Source-wise income visualization

### 4. **Recurring Transactions**
   - Automate recurring expenses and income
   - Set frequency (daily, weekly, monthly, yearly)
   - Automatic transaction generation and scheduling
   - Stop or modify recurring patterns

### 5. **Financial Dashboard**
   - Real-time financial overview
   - Profit/Loss summary
   - Last 30 days expense trends
   - Recent transactions view
   - Interactive charts (Bar, Line, Pie charts)

### 6. **AI Finance Assistant**
   - Chat-based financial advice powered by Google Gemini API
   - Get personalized insights on expenses and income
   - Budget recommendations and financial tips
   - Natural language processing for queries

### 7. **User Settings**
   - Theme preferences (Dark/Light mode)
   - Profile management
   - Account settings

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    User's Browser / Client                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        React + Vite Frontend Application                 │   │
│  │  ┌────────────────┐  ┌─────────────────────────────┐    │   │
│  │  │  Components    │  │  Pages                      │    │   │
│  │  │  - Dashboard   │  │  - Home/Dashboard           │    │   │
│  │  │  - Charts      │  │  - Expense Management       │    │   │
│  │  │  - Forms       │  │  - Income Management        │    │   │
│  │  │  - Cards       │  │  - Settings                 │    │   │
│  │  │  - AI Chat     │  │  - Authentication           │    │   │
│  │  └────────────────┘  └─────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────┐    │   │
│  │  │  State Management & Context                    │    │   │
│  │  │  - UserContext (Auth, User Data)               │    │   │
│  │  │  - ThemeContext (Dark/Light Mode)              │    │   │
│  │  │  - Custom Hooks (useUserAuth)                  │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│       Axios HTTP Requests │                                      │
│                           ▼                                      │
└─────────────────────────────────────────────────────────────────┘
                            │
                   CORS Policy Check
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend Server (Express.js)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API Routes (/api/v1)                  │   │
│  │  - /auth - Authentication & User Management             │   │
│  │  - /expense - Expense CRUD Operations                   │   │
│  │  - /income - Income CRUD Operations                     │   │
│  │  - /dashboard - Financial Summaries & Analytics         │   │
│  │  - /settings - User Settings & Preferences             │   │
│  │  - /ai - Chat with Gemini API                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│         ┌─────────────────┼─────────────────────┐               │
│         ▼                 ▼                     ▼               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐     │
│  │ Controllers  │  │  Middleware  │  │   External APIs  │     │
│  │ - Auth       │  │ - Auth       │  │ - Gemini API     │     │
│  │ - Expense    │  │ - Upload     │  │ - File Storage   │     │
│  │ - Income     │  │ - CORS       │  └──────────────────┘     │
│  │ - Dashboard  │  └──────────────┘                            │
│  │ - Chat       │                                              │
│  │ - Settings   │                                              │
│  └──────────────┘                                              │
│         │                                                       │
│  ┌──────┴─────────────────────────────────────┐               │
│  │         Business Logic Layer                │               │
│  │  - Services:                                │               │
│  │    • financeSummaryService                  │               │
│  │    • recurringTransactionService            │               │
│  │    • transactionHelpers                     │               │
│  │  - Utilities                                │               │
│  └─────────────────────────────────────────────┘               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────────────────────────────────┐                 │
│  │  Data Models (Mongoose Schemas)          │                 │
│  │  - User                                  │                 │
│  │  - Expense                               │                 │
│  │  - Income                                │                 │
│  │  - RecurringTransaction                  │                 │
│  └──────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                 MongoDB Connection
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Database (MongoDB)                           │
│  - Collections: users, expenses, income, recurrrecurrings       │
│  - Cloud Hosted: MongoDB Atlas                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- **Framework**: React 18+ with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Custom React Chart Components (Recharts integration ready)
- **Icons**: React Icons

**Backend:**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **File Upload**: Multer
- **External API**: Google Gemini API (AI Chat)
- **Environment**: dotenv

**Deployment:**
- **Frontend**: Vercel or Netlify
- **Backend**: Render or Railway
- **Database**: MongoDB Atlas (free tier available)

### Data Model

```
User
├── fullName: String
├── email: String (unique)
├── password: String (hashed)
├── profilePhoto: String (URL)
└── timestamps: Date

Expense
├── userId: ObjectId (ref: User)
├── title: String
├── icon: String (emoji/image URL)
├── amount: Number
├── date: Date
├── category: String
└── timestamps: Date

Income
├── userId: ObjectId (ref: User)
├── title: String
├── icon: String (emoji/image URL)
├── amount: Number
├── source: String
├── date: Date
└── timestamps: Date

RecurringTransaction
├── userId: ObjectId (ref: User)
├── type: String (expense/income)
├── frequency: String (daily/weekly/monthly/yearly)
├── nextOccurrence: Date
├── template: {
│   ├── title: String
│   ├── icon: String
│   ├── amount: Number
│   └── ... transaction details
│}
└── timestamps: Date
```

### API Endpoints

**Authentication:**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/getUser` - Get current user info (protected)
- `POST /api/v1/auth/upload-image` - Upload profile photo (protected)

**Expenses:**
- `GET /api/v1/expense` - Get all expenses (protected)
- `POST /api/v1/expense` - Create expense (protected)
- `PUT /api/v1/expense/:id` - Update expense (protected)
- `DELETE /api/v1/expense/:id` - Delete expense (protected)

**Income:**
- `GET /api/v1/income` - Get all income entries (protected)
- `POST /api/v1/income` - Create income (protected)
- `PUT /api/v1/income/:id` - Update income (protected)
- `DELETE /api/v1/income/:id` - Delete income (protected)

**Dashboard:**
- `GET /api/v1/dashboard/summary` - Get financial summary (protected)
- `GET /api/v1/dashboard/trends` - Get expense trends (protected)

**Settings:**
- `GET /api/v1/settings` - Get user settings (protected)
- `PUT /api/v1/settings` - Update user settings (protected)

**AI Chat:**
- `POST /api/v1/ai/chat` - Chat with AI assistant (protected)

### Recurring Transaction System

The application includes an automated recurring transaction processor that:
1. Runs periodically in the background
2. Checks for due recurring transactions
3. Automatically creates new expense/income entries
4. Updates the next occurrence date
5. Stops when end date is reached

---

## 🚀 Deployment Guide

### Prerequisites
- MongoDB Atlas account (free tier available)
- Render or Railway account for backend
- Vercel or Netlify account for frontend
- Google Gemini API key (for AI features)

### Deployment Steps

#### 1. Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables:
   - `MONGO_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Random secret for JWT signing
   - `PORT` - Optional (Render assigns automatically)
   - `CLIENT_URL` - Your deployed frontend URL
   - `GEMINI_API_KEY` - API key from Google AI Studio
   - `GEMINI_MODEL` - Model name (e.g., "gemini-1.5-flash")

4. Build command: None
5. Start command: `npm start`

#### 2. Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Select `frontend/expense-tracker` as the root directory
4. Set environment variables:
   - `VITE_API_BASE_URL` - Your backend URL (e.g., `https://your-backend.onrender.com/api/v1`)

5. Deploy

#### 3. Local Development

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend/expense-tracker
npm install
npm run dev
```

---

## 📁 Project Structure

```
ExpenseTracker/
├── backend/
│   ├── config/              # Database configuration
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   ├── utils/               # Helper functions
│   ├── uploads/             # User uploaded files
│   ├── server.js            # Entry point
│   └── package.json
│
└── frontend/expense-tracker/
    ├── src/
    │   ├── components/      # React components
    │   ├── context/         # Context API (Theme, User)
    │   ├── hooks/           # Custom React hooks
    │   ├── pages/           # Page components
    │   ├── utils/           # Utility functions
    │   ├── assets/          # Images, icons
    │   ├── App.jsx          # Root component
    │   └── main.jsx         # Entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **CORS**: Configured to allow only trusted domains
- **Bearer Token**: Used for API authentication (no cookies)
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Restricted file types for uploads
- **Protected Routes**: Middleware-based route protection

---

## 🤝 Contributing

When making changes:
1. Follow existing code structure and naming conventions
2. Create features in a new branch
3. Test thoroughly before submitting
4. Update documentation as needed

---

## 📝 License

This project is open source and available under the MIT License.

---

**Happy tracking! 💸**
