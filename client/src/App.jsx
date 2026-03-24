import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplyLicense from './pages/ApplyLicense';
import RenewLicense from './pages/RenewLicense';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationDetails from './pages/ApplicationDetails';

/* 👉 NEW IMPORTS */
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import BusinessProfile from './pages/BusinessProfile';
import ApplicationStatus from './pages/ApplicationStatus';
import ManageApplication from './pages/ManageApplication';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/apply-license"
              element={
                <PrivateRoute>
                  <ApplyLicense />
                </PrivateRoute>
              }
            />
            <Route
              path="/renew-license"
              element={
                <PrivateRoute>
                  <RenewLicense />
                </PrivateRoute>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <PrivateRoute>
                  <ApplicationDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/application-status"
              element={
                <PrivateRoute>
                  <ApplicationStatus />
                </PrivateRoute>
              }
            />
            <Route
              path="/business-profile"
              element={
                <PrivateRoute>
                  <BusinessProfile />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/manage-applications"
              element={
                <AdminRoute>
                  <ManageApplication />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>

          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
