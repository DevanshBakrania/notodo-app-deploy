import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaTasks, FaStickyNote } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar'; 
import Auth from './pages/Auth';
import Tasks from './pages/Tasks';
import Notes from './pages/Notes';
import Categories from './pages/Categories'; 
import API from './api'; 

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ 
    totalTasks: 0, completedTasks: 0, recentTasks: [], recentNotes: [] 
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/dashboard');
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats");
      }
    };
    fetchStats();
  }, []);

  const progress = stats.totalTasks === 0 ? 0 : Math.round((stats.completedTasks / stats.totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name} 👋</h1>
          <p className="text-gray-500">Here is your daily overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-blue-100 font-medium">Task Completion</p>
              <h2 className="text-4xl font-bold mt-1">{progress}%</h2>
            </div>
            <div className="h-16 w-16 border-4 border-blue-400 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-2xl" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-orange-100 text-orange-600 rounded-xl">
              <FaTasks className="text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalTasks}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
              <FaStickyNote className="text-2xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Notes</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.recentNotes.length}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
              <Link to="/tasks" className="text-blue-600 text-sm font-semibold hover:underline">View All</Link>
            </div>
            
            <div className="space-y-4">
              {stats.recentTasks.length === 0 ? <p className="text-gray-400">No tasks yet.</p> : null}
              {stats.recentTasks.map(task => (
                <div key={task._id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className={`w-3 h-3 rounded-full ${task.isComplete ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className="flex-1">
                    <p className={`font-medium ${task.isComplete ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.title}</p>
                    <span className="text-xs text-gray-400">{task.priority} Priority</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/tasks" className="block mt-6 text-center w-full py-2 bg-gray-50 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition">
              + Add New Task
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Notes</h2>
              <Link to="/notes" className="text-blue-600 text-sm font-semibold hover:underline">View All</Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {stats.recentNotes.length === 0 ? <p className="text-gray-400">No notes yet.</p> : null}
              {stats.recentNotes.map(note => (
                <div key={note._id} className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <h3 className="font-bold text-gray-800 truncate">{note.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{note.content}</p>
                </div>
              ))}
            </div>
            <Link to="/notes" className="block mt-6 text-center w-full py-2 bg-gray-50 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition">
              + Create Note
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <Navbar /> 
      <Routes>
        <Route path="/" element={<Auth />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;