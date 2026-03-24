# MSE License Renewal Portal

A full-stack web application for Micro and Small Enterprises (MSEs) to manage license renewals and registrations. The system allows MSE owners to apply for licenses, renew existing ones, upload documents, make payments, and track application status. Admin users can verify and approve/reject applications.

## Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Styling framework
- **React Router** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## Features

### MSE User Features
- ✅ User registration and authentication
- ✅ Dashboard with license overview and statistics
- ✅ Apply for new licenses
- ✅ Renew existing licenses
- ✅ Upload required documents (PDF, JPG, PNG)
- ✅ Online fee payment (mock payment gateway)
- ✅ Track application status (Pending / Under Review / Approved / Rejected)
- ✅ View application details and admin remarks

### Admin Features
- ✅ Secure admin login
- ✅ Admin dashboard with statistics
- ✅ View all applications
- ✅ Filter applications by status
- ✅ Review application details and documents
- ✅ Approve/Reject applications with remarks
- ✅ Automatic license renewal on approval
- ✅ View all users and licenses

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   └── App.jsx        # Main app component
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Backend Express application
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── middleware/        # Custom middleware
    ├── scripts/           # Seed data script
    ├── uploads/           # Uploaded files
    ├── server.js          # Entry point
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mse_license_portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On Windows
net start MongoDB

# On Mac/Linux
mongod
```

5. Seed the database with sample data (optional):
```bash
npm run seed
```

6. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Licenses
- `GET /api/licenses` - Get all licenses for user (protected)
- `GET /api/licenses/:id` - Get license by ID (protected)
- `POST /api/licenses` - Create new license (protected)

### Applications
- `GET /api/applications` - Get all applications (protected)
- `GET /api/applications/:id` - Get application by ID (protected)
- `POST /api/applications` - Create new application (protected)
- `POST /api/applications/:id/upload` - Upload documents (protected)

### Payments
- `POST /api/payments/create-order` - Create payment order (protected)
- `POST /api/payments/verify` - Verify payment (protected)
- `GET /api/payments/:applicationId` - Get payment status (protected)

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats (admin only)
- `GET /api/admin/applications` - Get all applications (admin only)
- `PUT /api/admin/applications/:id/approve` - Approve application (admin only)
- `PUT /api/admin/applications/:id/reject` - Reject application (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/licenses` - Get all licenses (admin only)

### User
- `GET /api/users/dashboard` - Get user dashboard data (protected)
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## Sample Login Credentials

After running the seed script, you can use these credentials:

### Admin
- Email: `admin@mseportal.com`
- Password: `admin123`

### MSE Users
- Email: `rajesh@example.com` / Password: `user123`
- Email: `priya@example.com` / Password: `user123`
- Email: `amit@example.com` / Password: `user123`

## Database Models

### User
- name, email, password, role
- businessName, businessType, registrationNumber
- address, phone

### License
- licenseId (unique), userId, type
- issueDate, expiryDate, status
- renewalFee

### Application
- userId, licenseId, applicationType
- documents[], paymentStatus, paymentId
- status, adminRemarks, reviewedBy
- amount, createdAt, updatedAt

## Features in Detail

### Document Upload
- Supports PDF, JPG, JPEG, PNG files
- Maximum file size: 5MB per file
- Files are stored in `server/uploads/` directory
- Multiple files can be uploaded per application

### Payment System
- Currently uses a mock payment gateway
- In production, integrate with Razorpay by:
  1. Adding Razorpay credentials to `.env`
  2. Updating `/api/payments/create-order` to create Razorpay orders
  3. Updating `/api/payments/verify` to verify Razorpay signatures

### License Renewal Workflow
1. User selects license to renew
2. Application is created with status "pending"
3. User uploads required documents
4. User makes payment
5. Status changes to "under_review"
6. Admin reviews application and documents
7. Admin approves/rejects with remarks
8. If approved, license expiry date is extended by 1 year

## Development Notes

- JWT tokens expire in 7 days (configurable in `.env`)
- File uploads are stored locally (can be configured for cloud storage)
- Password hashing uses bcrypt with salt rounds of 10
- CORS is enabled for all origins (configure for production)

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a secure `JWT_SECRET`
3. Configure MongoDB Atlas or a production MongoDB instance
4. Set up proper file storage (AWS S3, Cloudinary, etc.)
5. Integrate real payment gateway (Razorpay)
6. Set up SSL/HTTPS
7. Configure CORS for your domain
8. Use environment variables for all sensitive data

## License

This project is created for educational purposes.

## Contributing

Feel free to submit issues and enhancement requests!

