import React, { useState, useEffect } from 'react';
import API from '../api';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500'); 
  const navigate = useNavigate();

  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 
    'bg-red-500', 'bg-purple-500', 'bg-pink-500', 
    'bg-cyan-500', 'bg-orange-500'
  ];

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch categories");
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const { data } = await API.post('/categories', { name, color: selectedColor });
      setCategories([data, ...categories]);
      setName(''); 
      setSelectedColor('bg-blue-500');
      toast.success('Category created!');
    } catch (err) {
      toast.error('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await API.delete(`/categories/${id}`);
        setCategories(categories.filter((cat) => cat._id !== id));
        toast.success('Category deleted');
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Categories</h1>
        <p className="text-gray-500 mt-1">Organize your tasks and notes</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Create New Category</h3>
        
        <form onSubmit={handleCreate}>
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Category Name</label>
            <input 
              type="text" 
              placeholder="e.g., Work, Personal, Hobbies" 
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Pick a Color</label>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-10 h-10 rounded-full transition-all duration-200 
                    ${color} 
                    ${selectedColor === color ? 'ring-4 ring-offset-2 ring-gray-200 scale-110' : 'hover:scale-110 opacity-70 hover:opacity-100'}
                  `}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-1 flex items-center gap-2"
          >
            <FaPlus /> Save Category
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading categories...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-400">
              No categories found. Create one above!
            </div>
          ) : (
            categories.map((cat) => (
              <div 
                key={cat._id} 
                onClick={() => navigate('/tasks', { state: { filter: cat.name, openForm: true } })}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer"
              >
                
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${cat.color}`}></div>
                  
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
                    <p className="text-xs text-gray-400">Created {new Date(cat.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDelete(cat._id);
                  }}
                  className="p-2 text-gray-300 hover:text-red-500 bg-transparent hover:bg-red-50 rounded-full transition-all"
                  title="Delete Category"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Categories;