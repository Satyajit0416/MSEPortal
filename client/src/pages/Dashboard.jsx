import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/users/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-white rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Welcome to your Dashboard</h1>
              <p className="text-gray-600 mt-1">Quick overview of your licenses and applications. Manage tasks or apply for new licenses below.</p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/apply-license" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                <span className="text-sm font-medium">New Application</span>
              </Link>
              <Link to="/renew-license" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h4l3 8 4-18 3 8h4"/></svg>
                <span className="text-sm font-medium text-gray-700">Renew License</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Licenses', value: dashboardData?.stats?.totalLicenses, color: 'text-gray-900', icon: (
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg>
            )},
            { label: 'Active Licenses', value: dashboardData?.stats?.activeLicenses, color: 'text-green-600', icon: (
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            )},
            { label: 'Pending Applications', value: dashboardData?.stats?.pendingApplications, color: 'text-yellow-600', icon: (
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"/></svg>
            )},
            { label: 'Expiring Soon', value: dashboardData?.stats?.expiringSoon, color: 'text-red-600', icon: (
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1"/></svg>
            )}
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className={`text-2xl font-semibold mt-1 ${item.color}`}>{item.value || 0}</p>
                </div>
                <div className="bg-gray-100 rounded-full p-3">{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/apply-license" className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow hover:scale-[1.01] transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
              <div>
                <div className="font-medium">Apply for New License</div>
                <div className="text-sm opacity-80">Start a new registration</div>
              </div>
            </Link>

            <Link to="/renew-license" className="flex items-center gap-3 p-4 rounded-lg bg-white border border-gray-200 hover:shadow-sm transition">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h4l3 8 4-18 3 8h4"/></svg>
              <div>
                <div className="font-medium">Renew Existing License</div>
                <div className="text-sm text-gray-600">Renew quickly and securely</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Licenses */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Licenses</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData?.recentLicenses?.length > 0 ? (
              dashboardData.recentLicenses.map((license) => (
                <div key={license._id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{license.licenseId}</p>
                      <p className="text-sm text-gray-500">Type: {license.type}</p>
                      <p className="text-sm text-gray-500">Expiry: {new Date(license.expiryDate).toLocaleDateString()}</p>
                    </div>

                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${license.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{license.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-5 text-center text-gray-500">No licenses found</p>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData?.recentApplications?.length > 0 ? (
              dashboardData.recentApplications.map((app) => (
                <Link key={app._id} to={`/applications/${app._id}`} className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Application #{app._id.slice(-8)}</p>
                      <p className="text-sm text-gray-500">{app.applicationType} — {app.licenseId?.licenseId}</p>
                    </div>

                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusBadge(app.status)}`}>{app.status.replace('_', ' ')}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="p-5 text-center text-gray-500">No applications found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
