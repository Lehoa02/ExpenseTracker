# ExpenseTracker Deployment Guide

This repository is split into two apps:

- `backend/` - Node.js + Express API
- `frontend/expense-tracker/` - React + Vite client

The simplest free hosting setup is:

- Frontend: Vercel or Netlify
- Backend: Render
- Database: MongoDB Atlas free tier

## 1. Backend setup

Deploy the `backend/` folder as a Render Web Service.

### Build and start commands

- Build command: none
- Start command: `npm start`

### Required environment variables

Set these in Render:

- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - secret used to sign auth tokens
- `PORT` - optional; Render will provide one automatically
- `CLIENT_URL` - your deployed frontend URL
- `GEMINI_API_KEY` - required if the AI assistant is enabled
- `GEMINI_MODEL` - optional; defaults to your chosen Gemini model

### Notes

- The backend uses Bearer token auth, so it does not rely on cookies.
- CORS should allow the exact frontend domain through `CLIENT_URL`.
- Free backend hosts can sleep when idle, so the first request may be slower.

## 2. Frontend setup

Deploy the `frontend/expense-tracker/` folder to Vercel or Netlify.

### Build settings

- Build command: `npm run build`
- Output folder: `dist`

### Required environment variable

Set this at build time:

- `VITE_API_BASE_URL` - your backend URL, for example `https://your-backend.onrender.com/api/v1`

## 3. MongoDB Atlas

Create a free MongoDB Atlas cluster and copy the connection string into `MONGO_URI`.

## 4. Suggested deployment order

1. Create the MongoDB Atlas cluster.
2. Deploy the backend to Render.
3. Copy the backend public URL.
4. Set `VITE_API_BASE_URL` in the frontend to that backend URL plus `/api/v1`.
5. Deploy the frontend to Vercel or Netlify.
6. Set `CLIENT_URL` on the backend to the final frontend URL.

## 5. Local development

Backend:

```bash
cd backend
npm install
npm start
```

Frontend:

```bash
cd frontend/expense-tracker
npm install
npm run dev
```
