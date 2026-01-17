import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCheckSquare, FaSignOutAlt } from 'react-icons/fa';
// REMOVED: import ThemeToggle

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
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/notes', label: 'Notes' },
    { path: '/categories', label: 'Categories' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200">
              <FaCheckSquare />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-800">
              NOTODO
            </span>
          </Link>

          {isAuth && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`
                    px-5 py-2.5 rounded-full font-medium transition-all duration-200
                    ${location.pathname === link.path 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {isAuth && (
            <div className="flex items-center gap-2">
              {/* REMOVED: <ThemeToggle /> */}
              
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;