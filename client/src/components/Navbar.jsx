import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Home');
  };

  const [open, setOpen] = useState(false);

  const initials = (nameOrEmail => {
    if (!nameOrEmail) return 'U';
    const parts = nameOrEmail.split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  })(user?.name || user?.email);

  const avatarSrc = user?.logoUrl ? (user.logoUrl.startsWith('http') ? user.logoUrl : API_BASE + user.logoUrl) : null;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to={isAdmin ? '/pages/home' : '/home'} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                MSE
              </div>
              <span className="text-xl font-semibold tracking-tight">MSE Portal</span>
            </Link>

            {/* NAV LINKS (desktop) */}
            {!isAdmin && user && (
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-white/10 transition">Dashboard</Link>
                <Link to="/apply-license" className="px-3 py-2 rounded hover:bg-white/10 transition">Apply License</Link>
                <Link to="/renew-license" className="px-3 py-2 rounded hover:bg-white/10 transition">Renew License</Link>
                <Link to="/application-status" className="px-3 py-2 rounded hover:bg-white/10 transition">My Applications</Link>
                <Link to="/business-profile" className="px-3 py-2 rounded hover:bg-white/10 transition">Profile</Link>
                <Link to="/about" className="px-3 py-2 rounded hover:bg-white/10 transition">About</Link>
                <Link to="/contact" className="px-3 py-2 rounded hover:bg-white/10 transition">Contact</Link>
              </div>
            )}

            {isAdmin && (
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <Link to="/admin/dashboard" className="px-3 py-2 rounded hover:bg-white/10 transition">Dashboard</Link>
                <Link to="/admin/manage-applications" className="px-3 py-2 rounded hover:bg-white/10 transition">Applications</Link>
                <Link to="/admin/users" className="px-3 py-2 rounded hover:bg-white/10 transition">Users</Link>
                <Link to="/about" className="px-3 py-2 rounded hover:bg-white/10 transition">About</Link>
                <Link to="/contact" className="px-3 py-2 rounded hover:bg-white/10 transition">Contact</Link>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded hover:bg-white/10 transition"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <Link to={!isAdmin ? '/business-profile' : '#'} className="hidden sm:flex items-center gap-3">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="avatar" className="w-9 h-9 rounded-full object-cover border-2 border-white" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white text-indigo-700 flex items-center justify-center font-semibold">{initials}</div>
                  )}
                  <span className="text-sm font-medium">{user?.name || user?.email}</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-md text-sm transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white text-gray-800 shadow-md">
          <div className="px-4 py-3 space-y-1">
            {!isAdmin && user && (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
                <Link to="/apply-license" className="block px-3 py-2 rounded hover:bg-gray-100">Apply License</Link>
                <Link to="/renew-license" className="block px-3 py-2 rounded hover:bg-gray-100">Renew License</Link>
                <Link to="/application-status" className="block px-3 py-2 rounded hover:bg-gray-100">My Applications</Link>
                <Link to="/business-profile" className="block px-3 py-2 rounded hover:bg-gray-100">Profile</Link>
                <Link to="/about" className="block px-3 py-2 rounded hover:bg-gray-100">About</Link>
                <Link to="/contact" className="block px-3 py-2 rounded hover:bg-gray-100">Contact</Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
                <Link to="/admin/manage-applications" className="block px-3 py-2 rounded hover:bg-gray-100">Applications</Link>
                <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-100">Users</Link>
                <Link to="/about" className="block px-3 py-2 rounded hover:bg-gray-100">About</Link>
                <Link to="/contact" className="block px-3 py-2 rounded hover:bg-gray-100">Contact</Link>
              </>
            )}

            {user && (
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
