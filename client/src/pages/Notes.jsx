import React, { useState, useEffect } from 'react';
import API from '../api';
import { FaPlus, FaSearch, FaFilter, FaTrash, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All'); 
  
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General' });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const [notesRes, catRes] = await Promise.all([
        API.get('/notes'),
        API.get('/categories')
      ]);
      setNotes(notesRes.data);
      setCategories(catRes.data);
    } catch (err) { 
      console.error("Error fetching data"); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
        toast.error('Title and content are required');
        return;
    }

    try {
      if (editingId) {
        const { data } = await API.put(`/notes/${editingId}`, formData);
        setNotes(notes.map(n => n._id === editingId ? data : n));
        toast.success('Note updated successfully!'); 
      } else {
        const { data } = await API.post('/notes', formData);
        setNotes([data, ...notes]);
        toast.success('Note created successfully!'); 
      }
      setFormData({ title: '', content: '', category: 'General' });
      setEditingId(null);
      setShowForm(false);
    } catch (err) { 
      toast.error('Error saving note'); 
    }
  };

  const handleEditClick = (note) => {
    setFormData({ title: note.title, content: note.content, category: note.category || 'General' });
    setEditingId(note._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this note?")) {
      try {
        await API.delete(`/notes/${id}`);
        setNotes(notes.filter(n => n._id !== id));
        toast.success('Note deleted'); 
      } catch(err) { 
        toast.error("Failed to delete"); 
      }
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (categoryFilter !== 'All') {
      matchesCategory = (note.category || 'General') === categoryFilter;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
    
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Notes</h1>
          <p className="text-gray-500 mt-1">Capture your ideas</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 flex items-center gap-2"
        >
          <FaPlus /> {showForm ? 'Close' : 'Create Note'}
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-5 top-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search notes..." 
            className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-64">
           <FaFilter className="absolute left-5 top-4 text-gray-400 z-10" />
           <select 
             value={categoryFilter}
             onChange={(e) => setCategoryFilter(e.target.value)}
             className="w-full pl-12 pr-6 py-3 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
           >
             <option value="All">All Categories</option>
             <option value="General">General</option>
             {categories.map(cat => (
                 <option key={cat._id} value={cat.name}>{cat.name}</option>
             ))}
           </select>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSaveNote} className="bg-white p-6 rounded-3xl shadow-xl mb-8 border border-gray-100 ring-1 ring-blue-100">
          <h2 className="text-xl font-bold text-gray-700 mb-4">{editingId ? 'Edit Note' : 'Create New Note'}</h2>
          
          <input 
            type="text" 
            placeholder="Title" 
            className="w-full text-lg font-bold mb-4 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          
          <textarea 
            placeholder="Write your note here..." 
            className="w-full h-40 p-4 resize-none focus:outline-none bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 mb-4"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
          ></textarea>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-1/3">
                <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Category</label>
                <select 
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                    <option value="General">General</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold shadow-md transition mt-4 sm:mt-0">
              {editingId ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 ? (
           <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
             <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-3xl mb-4">
               💡
             </div>
             <h3 className="text-xl font-bold text-gray-700">No notes found</h3>
             <p className="text-gray-400 mt-1">Have an idea? Write it down!</p>
           </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all group relative">
                <h3 className="font-bold text-gray-800 text-lg mb-2">{note.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {note.category || 'General'}
                  </span>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(note)} className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition">
                        <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(note._id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition">
                        <FaTrash />
                    </button>
                  </div>
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;