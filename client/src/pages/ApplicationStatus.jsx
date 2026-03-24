import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
    fetchRecentApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/applications/my');
      setApplications(res.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const fetchRecentApplications = async () => {
    try {
      const response = await axios.get('/api/users/dashboard');
      setRecentApplications(response.data.recentApplications || []);
    } catch (error) {
      console.error('Failed to fetch recent applications:', error);
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
        <div className="max-w-6xl mx-auto px-4 py-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Application Status</h1>
            <p className="text-gray-600">Track the status of your license applications — quick overview of recent submissions.</p>
          </div>
          <div>
            <Link to="/apply-license" className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow">Apply for a License</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Applications</h2>

        {recentApplications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentApplications.map((app) => (
              <Link
                key={app._id}
                to={`/applications/${app._id}`}
                className="block bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Application #{app._id.slice(-8)}</div>
                    <div className="font-semibold text-lg text-gray-900">{app.applicationType || '—'}</div>
                    <div className="text-sm text-gray-500 mt-1">{app.licenseId?.licenseId || 'License: N/A'}</div>
                    <div className="text-xs text-gray-400 mt-2">Submitted: {new Date(app.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(app.status)}`}>{app.status.replace('_', ' ')}</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border rounded-lg p-6 text-center text-gray-500">No recent applications found</div>
        )}
      </div>
    </>
  );
};

export default ApplicationStatus;
