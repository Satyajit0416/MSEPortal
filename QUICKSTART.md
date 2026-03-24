# Quick Start Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Steps

### 1. Backend Setup

```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mse_license_portal
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

Seed database (optional):
```bash
npm run seed
```

Start server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### 4. Test Credentials (after seeding)

**Admin:**
- Email: admin@mseportal.com
- Password: admin123

**User:**
- Email: rajesh@example.com
- Password: user123

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
└── README.md        # Full documentation
```

For detailed documentation, see README.md

