import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await axios.get(`/api/applications/${id}`);
      setApplication(res.data);
    } catch {
      toast.error('Failed to load application');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentBadge = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleFileUpload = async () => {
    if (!selectedFiles.length) return toast.error('Select files first');

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((f) => formData.append('documents', f));

    try {
      await axios.post(`/api/applications/${id}/upload`, formData);
      toast.success('Documents uploaded');
      setSelectedFiles([]);
      fetchApplication();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePayment = async () => {
    setProcessingPayment(true);
    try {
      const order = await axios.post('/api/payments/create-order', { applicationId: id });
      await axios.post('/api/payments/verify', {
        applicationId: id,
        paymentId: order.data.orderId,
        paymentSignature: 'mock'
      });
      toast.success('Payment successful');
      fetchApplication();
    } catch {
      toast.error('Payment failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleApprove = async () => {
    if (!adminRemarks.trim()) return toast.error('Remarks required');
    setActionLoading(true);
    try {
      await axios.put(`/api/admin/applications/${id}/approve`, { adminRemarks });
      toast.success('Application approved');
      fetchApplication();
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!adminRemarks.trim()) return toast.error('Remarks required');
    setActionLoading(true);
    try {
      await axios.put(`/api/admin/applications/${id}/reject`, { adminRemarks });
      toast.success('Application rejected');
      fetchApplication();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading application details...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          to={isAdmin ? '/admin/dashboard' : '/dashboard'}
          className="text-sm text-blue-600"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-semibold text-gray-900 mt-4 mb-6">
          Application Details
        </h1>

        {/* Application Info */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Application Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Application ID</p>
              <p>{application._id.slice(-8)}</p>
            </div>

            <div>
              <p className="text-gray-500">Type</p>
              <p className="capitalize">{application.applicationType}</p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(application.status)}`}>
                {application.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <p className="text-gray-500">Payment</p>
              <span className={`px-3 py-1 text-xs rounded-full ${getPaymentBadge(application.paymentStatus)}`}>
                {application.paymentStatus}
              </span>
            </div>

            <div>
              <p className="text-gray-500">Amount</p>
              <p>₹{application.amount}</p>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Documents</h2>

          {application.documents.length > 0 ? (
            <ul className="space-y-2">
              {application.documents.map((doc, i) => (
                <li key={i} className="flex justify-between text-sm bg-gray-50 p-3 rounded">
                  <span>{doc.name}</span>
                  <a
                    href={`http://localhost:5000${doc.filePath}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No documents uploaded</p>
          )}

          {!isAdmin && application.status === 'pending' && (
            <div className="mt-4">
              <input type="file" multiple onChange={handleFileChange} />
              <button
                onClick={handleFileUpload}
                disabled={uploading}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                {uploading ? 'Uploading...' : 'Upload Documents'}
              </button>
            </div>
          )}
        </div>

        {/* Payment */}
        {!isAdmin && application.paymentStatus === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h2 className="font-semibold mb-2">Payment Required</h2>
            <button
              onClick={handlePayment}
              disabled={processingPayment}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {processingPayment ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        )}

        {/* Admin Actions */}
        {isAdmin && application.status !== 'approved' && application.status !== 'rejected' && (
          <div className="bg-gray-50 border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Admin Action</h2>
            <textarea
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              rows="3"
              className="w-full border rounded p-2 mb-3"
              placeholder="Enter remarks"
            />
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicationDetails;
