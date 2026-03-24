# Server Setup

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mse_license_portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Run Seed Data

To populate the database with sample data:

```bash
npm run seed
```

## Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Base URL

http://localhost:5000/api

