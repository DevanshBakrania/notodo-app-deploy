import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCheckSquare, FaSignOutAlt, FaChartPie, FaTasks, FaStickyNote, FaTags } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = !!localStorage.getItem('token');

  if (location.pathname === '/') return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartPie /> },
    { path: '/tasks', label: 'Tasks', icon: <FaTasks /> },
    { path: '/notes', label: 'Notes', icon: <FaStickyNote /> },
    { path: '/categories', label: 'Cats', icon: <FaTags /> }, // "Cats" is shorter for mobile
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO: Text hidden on mobile to save space */}
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">
              <FaCheckSquare />
            </div>
            <span className="hidden sm:block text-xl font-extrabold tracking-tight text-gray-800">
              NOTODO
            </span>
          </Link>

          {/* LINKS: Visible on ALL screens now */}
          {isAuth && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mx-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`
                    flex items-center gap-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${location.pathname === link.path 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                >
                  <span className="text-lg sm:hidden">{link.icon}</span>
                  <span className="hidden sm:block">{link.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* LOGOUT: Icon only on mobile */}
          {isAuth && (
            <button 
              onClick={handleLogout} 
              className="shrink-0 flex items-center gap-2 text-gray-400 hover:text-red-600 font-medium px-2 py-2 rounded-lg transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;