import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckSquare } from 'react-icons/fa'; 
import { toast } from 'react-hot-toast'; // <--- IMPORT TOAST

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const loadingToast = toast.loading(isLogin ? 'Signing in...' : 'Creating account...'); // Loading state

    try {
      if (isLogin) {
        const { data } = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', data.token); 
        localStorage.setItem('user', JSON.stringify(data.user)); 
        
        toast.dismiss(loadingToast);
        toast.success(`Welcome back, ${data.user.name}!`); // Success Toast
        navigate('/dashboard'); 
      } else {
        await API.post('/auth/register', formData);
        
        toast.dismiss(loadingToast);
        toast.success('Registration successful! Please login.'); // Success Toast
        setIsLogin(true); 
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      toast.error(msg); // Error Toast
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    const loadingToast = toast.loading('Setting up guest account...');

    const randomId = Math.floor(Math.random() * 100000);
    const guestUser = {
      name: `Guest ${randomId}`,
      email: `guest_${randomId}@notodo.com`,
      password: "guestpassword" 
    };

    try {
      await API.post('/auth/register', guestUser);
      
      const { data } = await API.post('/auth/login', {
        email: guestUser.email,
        password: guestUser.password
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.dismiss(loadingToast);
      toast.success('Logged in as Guest');
      navigate('/dashboard');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Guest login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 relative">
      
      <div className="absolute top-0 left-0 p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-200 font-bold">
            <FaCheckSquare />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-gray-800">
            NOTODO
          </span>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? 'Sign in to continue' : 'Get started for free'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-500 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="John Doe"
                  onChange={handleChange} 
                  className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  required 
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FaEnvelope />
              </div>
              <input 
                type="email" 
                name="email" 
                placeholder="you@example.com"
                onChange={handleChange} 
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FaLock />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="••••••••"
                onChange={handleChange} 
                className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button 
          onClick={handleGuestLogin} 
          className="w-full py-3 rounded-xl font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          Continue as Guest
        </button>

        <p className="mt-8 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="font-bold text-blue-600 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;