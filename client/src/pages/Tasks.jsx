import React, { useState, useEffect } from 'react';
import API from '../api';
import TaskItem from '../components/TaskItem';
import { FaFilter, FaPlus, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', category: 'General', dueDate: '' });
  const [editingId, setEditingId] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('All');     
  const [categoryFilter, setCategoryFilter] = useState('All'); 
  const [sortBy, setSortBy] = useState('Newest');              
  
  const location = useLocation();

  const fetchData = async () => {
    try {
      const [tasksRes, catsRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/categories')
      ]);
      setTasks(tasksRes.data);
      setAvailableCategories(catsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (location.state && location.state.filter) {
        setCategoryFilter(location.state.filter);

        if (location.state.openForm) {
            setShowForm(true);
            setNewTask(prev => ({ ...prev, category: location.state.filter }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) {
        toast.error("Title is required!");
        return;
    }
    
    try {
        if (editingId) {
            const { data } = await API.put(`/tasks/${editingId}`, newTask);
            setTasks(tasks.map((t) => (t._id === editingId ? data : t))); 
            toast.success('Task updated successfully!'); 
        } else {
            const { data } = await API.post('/tasks', newTask);
            setTasks([data, ...tasks]);
            toast.success('New task created!'); 
        }

        setNewTask({ title: '', description: '', priority: 'Medium', category: 'General', dueDate: '' });
        setEditingId(null);
        setShowForm(false);
    } catch (err) { 
        toast.error('Failed to save task'); 
    }
  };

  const handleEditClick = (task) => {
    const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
    setNewTask({ 
        title: task.title, 
        description: task.description || '', 
        priority: task.priority, 
        category: task.category || 'General', 
        dueDate: formattedDate 
    });
    setEditingId(task._id);
    setShowForm(true); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success('Task deleted'); 
      } catch (err) { 
        toast.error('Error deleting task'); 
      }
    }
  };

  const handleUpdateStatus = async (id, updatedData) => {
    try {
      const { data } = await API.put(`/tasks/${id}`, updatedData);
      setTasks(tasks.map((t) => (t._id === id ? data : t)));
    } catch (err) { 
        toast.error('Could not update status'); 
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'Completed') matchesStatus = task.isComplete === true;
    if (statusFilter === 'Pending') matchesStatus = task.isComplete === false;
    if (statusFilter === 'High Priority') matchesStatus = task.priority === 'High';

    let matchesCategory = true;
    if (categoryFilter !== 'All') {
      matchesCategory = (task.category || 'General') === categoryFilter;
    }

    return matchesSearch && matchesStatus && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'A-Z') return a.title.localeCompare(b.title);
    if (sortBy === 'Priority') {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return 0;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Tasks</h1>
          <p className="text-gray-500 mt-1">Manage your daily goals</p>
        </div>
        <button 
          onClick={() => { 
              setShowForm(!showForm); 
              setEditingId(null); 
              setNewTask({ title: '', description: '', priority: 'Medium', category: 'General', dueDate: '' });
          }} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 flex items-center gap-2"
        >
          <FaPlus /> {showForm ? 'Close' : 'Add New Task'}
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-200 mb-8">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-5 top-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 border rounded-full font-medium flex items-center gap-2 transition-all ${showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            <FaFilter /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-down">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-3">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="High Priority">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-3">Category</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="General">General</option>
                {availableCategories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-3">Sort By</label>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                >
                  <option value="Newest">Date Created (Newest)</option>
                  <option value="Oldest">Date Created (Oldest)</option>
                  <option value="Priority">Priority (High to Low)</option>
                  <option value="A-Z">Alphabetical (A-Z)</option>
                </select>
                <FaSortAmountDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSaveTask} className="bg-white p-6 rounded-3xl shadow-xl mb-8 border border-gray-200 ring-1 ring-blue-100">
          <h3 className="text-lg font-bold text-gray-700 mb-4 ml-1">
             {editingId ? 'Edit Task' : 'Create New Task'}
          </h3>
          
          <div className="flex flex-col gap-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Task Title *</label>
                <input 
                type="text" 
                placeholder="What needs to be done?" 
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
                />
            </div>

            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Description</label>
                <textarea 
                placeholder="Add more details..." 
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none h-24"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                 <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Priority</label>
                 <select 
                    className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Category</label>
                <select 
                    className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                >
                    <option value="General">General</option>
                    {availableCategories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
              </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Due Date (Optional)</label>
                <input 
                    type="date" 
                    className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 mt-2">
              {editingId ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading your tasks...</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-full flex items-center justify-center text-3xl mb-4">
                📝
              </div>
              <h3 className="text-xl font-bold text-gray-700">No tasks found</h3>
              <p className="text-gray-400 mt-1">Try adjusting your filters.</p>
              <button onClick={() => {setStatusFilter('All'); setCategoryFilter('All'); setSearchQuery('')}} className="mt-6 text-blue-600 font-semibold hover:underline">
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem 
                key={task._id} 
                task={task} 
                categories={availableCategories} 
                onDelete={handleDelete} 
                onUpdate={handleUpdateStatus} 
                onEdit={handleEditClick} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;