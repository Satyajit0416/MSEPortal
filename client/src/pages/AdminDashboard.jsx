import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchApplications();
  }, [filterStatus]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.stats);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await axios.get('/api/admin/applications', { params });
      setApplications(response.data.applications || response.data);
    } catch {
      toast.error('Failed to load applications');
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
          Loading admin dashboard...
        </div>
      </>
    );
  }

  // const exportApplications = () => {
  //   try {
  //     const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(applications || [], null, 2));
  //     const dlAnchor = document.createElement('a');
  //     dlAnchor.setAttribute('href', dataStr);
  //     dlAnchor.setAttribute('download', `applications_${Date.now()}.json`);
  //     document.body.appendChild(dlAnchor);
  //     dlAnchor.click();
  //     dlAnchor.remove();
  //     toast.success('Applications exported');
  //   } catch (err) {
  //     toast.error('Failed to export applications');
  //   }
  // };

  const sortedRecent = [...applications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentApps = sortedRecent.slice(0, 5);
  const recentUsers = [...new Map(sortedRecent.map(a => [a.userId?._id || a.userId?.email, a.userId])).values()].slice(0, 5);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Overview of system activity and quick actions</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={fetchDashboardData} className="px-3 py-2 bg-white border rounded-md text-sm text-gray-700 hover:bg-gray-50">Refresh Stats</button>
            {/* <button onClick={exportApplications} className="px-3 py-2 bg-white border rounded-md text-sm text-gray-700 hover:bg-gray-50">Export JSON</button> */}
            <Link to="/admin/users" className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Manage Users</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Large stats */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {[
                { label: 'Total Applications', value: stats?.totalApplications, icon: '📄' },
                { label: 'Pending', value: stats?.pendingApplications, icon: '⏳', color: 'text-yellow-600' },
                { label: 'Approved', value: stats?.approvedApplications, icon: '✅', color: 'text-green-600' },
                { label: 'Total Users', value: stats?.totalUsers, icon: '👥', color: 'text-blue-600' }
              ].map((item, i) => (
                <div key={i} className="bg-white border rounded-lg p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-xl">{item.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className={`text-2xl font-semibold mt-1 ${item.color || 'text-gray-900'}`}>{item.value || 0}</p>
                    <p className="text-xs text-gray-400">Compared to previous period</p>
                  </div>
                </div>
              ))}
            </div>

            

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">All Applications</h3>
              <p className="text-sm text-gray-500 mb-4">A quick snapshot — click any application to open the details.</p>

              <div className="grid grid-cols-1 gap-2">
                {applications.slice(0, 6).map(app => (
                  <div key={app._id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <Link to={`/applications/${app._id}`} className="font-medium text-gray-900">#{app._id.slice(-8)}</Link>
                      <div className="text-xs text-gray-500">{app.applicationType} • {app.userId?.name || app.userId?.email}</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusBadge(app.status)}`}>{app.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Recent activity panels */}
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold">Recent Applications</h4>
              <div className="mt-3 space-y-2">
                {recentApps.length > 0 ? recentApps.map(a => (
                  <div key={a._id} className="flex items-center justify-between">
                    <div>
                      <Link to={`/applications/${a._id}`} className="font-medium text-gray-900">#{a._id.slice(-8)}</Link>
                      <div className="text-xs text-gray-500">{a.applicationType} • {a.userId?.name || a.userId?.email}</div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(a.status)}`}>{a.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                )) : <div className="text-sm text-gray-500">No recent applications</div>}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold">Recent Users</h4>
              <div className="mt-3 space-y-2">
                {recentUsers.length > 0 ? recentUsers.map((u, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold">{(u?.name || u?.email || 'U')[0]}</div>
                    <div>
                      <div className="text-sm font-medium">{u?.name || u?.email}</div>
                      <div className="text-xs text-gray-500">{u?.businessName || ''}</div>
                    </div>
                  </div>
                )) : <div className="text-sm text-gray-500">No recent users</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
