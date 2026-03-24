import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const ManageApplication = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await axios.get('/api/admin/applications', { params });
      setApplications(response.data.applications || response.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setActionLoading(true);
    try {
      const endpoint = newStatus === 'approved' ? 'approve' : 'reject';
      const payload = remarks.trim() ? { adminRemarks: remarks.trim() } : {};

      await axios.put(`/api/admin/applications/${applicationId}/${endpoint}`, payload);
      toast.success(`Application ${newStatus.replace('_', ' ')} successfully`);
      setSelectedApplication(null);
      setRemarks('');
      fetchApplications();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update application status';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading applications...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Manage Applications</h1>
            <p className="text-gray-600">Review and manage all license applications</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{applications.length}</span> applications</div>
            <button onClick={fetchApplications} className="px-3 py-2 bg-white border rounded-md text-sm text-gray-700 hover:bg-gray-50">Refresh</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filter */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {/* <option value="pending">Pending</option> */}
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex gap-2 mt-3 sm:mt-0">
            {/* <button onClick={() => setFilterStatus('pending')} className="px-3 py-2 bg-yellow-50 border rounded-md text-sm text-yellow-800">Pending</button> */}
            <button onClick={() => setFilterStatus('under_review')} className="px-3 py-2 bg-blue-50 border rounded-md text-sm text-blue-800">Under Review</button>
            <button onClick={() => setFilterStatus('approved')} className="px-3 py-2 bg-green-50 border rounded-md text-sm text-green-800">Approved</button>
            <button onClick={() => setFilterStatus('rejected')} className="px-3 py-2 bg-red-50 border rounded-md text-sm text-red-800">Rejected</button>
            <button onClick={() => setFilterStatus('')} className="px-3 py-2 border rounded-md text-sm">Clear</button>
          </div>
        </div>

        {/* Application List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">{(app.userId?.name || app.userId?.email || 'U')[0]}</div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link to={`/applications/${app._id}`} className="font-medium text-gray-900 hover:text-indigo-600">Application #{app._id.slice(-8)}</Link>
                        <div className="text-sm text-gray-500 mt-1">{app.applicationType} • {app.licenseId?.licenseId || 'N/A'}</div>
                        <div className="text-sm text-gray-500">User: {app.userId?.name || app.userId?.email}</div>
                        <div className="text-sm text-gray-500">Submitted: {new Date(app.createdAt).toLocaleDateString()}</div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusBadge(app.status)}`}>{app.status.replace('_', ' ')}</span>
                        {(app.status === 'pending' || app.status === 'under_review') && (
                          <button onClick={() => setSelectedApplication(app)} className="mt-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Review</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 p-6 text-center text-gray-500">No applications found</div>
          )}
        </div>

        {/* Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Application #{selectedApplication._id.slice(-8)}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks {selectedApplication && 'rejected' ? '(Required for rejection)' : '(Optional)'}
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Add any remarks..."
                  required={false} // We'll handle validation in the button click
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusUpdate(selectedApplication._id, 'approved')}
                  disabled={actionLoading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-green-700"
                >
                  {actionLoading ? 'Processing...' : 'Approve'}
                </button>
                <button
                  onClick={() => {
                    if (!remarks.trim()) {
                      toast.error('Remarks are required for rejection');
                      return;
                    }
                    handleStatusUpdate(selectedApplication._id, 'rejected');
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 text-white py-2 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-red-700"
                >
                  {actionLoading ? 'Processing...' : 'Reject'}
                </button>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 text-gray-600 text-sm font-medium hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageApplication;
