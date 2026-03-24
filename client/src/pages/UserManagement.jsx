import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('/api/admin/users');
    setUsers(res.data);
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.businessName || '').toLowerCase().includes(q);
  });

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">User Management</h1>
            <p className="text-gray-600">View and manage registered users of the portal</p>
          </div>

          <div className="flex items-center gap-3">
            {/* <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users" className="px-3 py-2 rounded-md border border-gray-200 text-sm" /> */}
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-md border border-gray-200 text-sm">
              <option value="all">All roles</option>
              <option value="mse_user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table / Cards */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-4 text-sm text-gray-500">Showing {filtered.length} of {users.length} users</div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                <th className="p-4 text-left font-semibold text-gray-700">Business</th>
                <th className="p-4 text-left font-semibold text-gray-700">Role</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((user) => (
                  <tr key={user._id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">{(user.name || user.email || 'U')[0]}</div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.businessName || '—'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden grid grid-cols-1 gap-4">
          {filtered.length > 0 ? (
            filtered.map(user => (
              <div key={user._id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">{(user.name || user.email || 'U')[0]}</div>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.role}</div>
                    <div className="text-xs text-gray-500 mt-2">{user.businessName || '—'}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserManagement;
