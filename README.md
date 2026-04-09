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

### Recurring Transaction System

The application includes an automated recurring transaction processor that:
1. Runs periodically in the background
2. Checks for due recurring transactions
3. Automatically creates new expense/income entries
4. Updates the next occurrence date
5. Stops when end date is reached

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

## 📝 License

This project is open source and available under the MIT License.

---

**Happy tracking! 💸**
