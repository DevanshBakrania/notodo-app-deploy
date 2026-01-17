import React from 'react';
import { FaTrash, FaCheck, FaCalendarAlt, FaEdit } from 'react-icons/fa';

// 1. Accept 'categories' prop to look up colors
const TaskItem = ({ task, categories, onDelete, onUpdate, onEdit }) => { 
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date().setHours(0,0,0,0) && !task.isComplete;

  // --- CARD BACKGROUND (Based on Priority) ---
  const getPriorityStyles = (priority, isComplete) => {
    if (isComplete) return 'bg-gray-50 border-gray-200 opacity-60';

    switch (priority) {
      case 'High':
        return 'bg-red-50 border-red-200 hover:border-red-300 hover:shadow-red-100';
      case 'Medium':
        return 'bg-amber-50 border-amber-200 hover:border-amber-300 hover:shadow-amber-100';
      case 'Low':
        return 'bg-green-50 border-green-200 hover:border-green-300 hover:shadow-green-100';
      default:
        return 'bg-white border-gray-100';
    }
  };

  const getTagStyles = (priority) => {
    switch (priority) {
      case 'High': return 'bg-white text-red-600 border-red-200';
      case 'Medium': return 'bg-white text-amber-600 border-amber-200';
      case 'Low': return 'bg-white text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  // --- CATEGORY TAG COLOR LOGIC ---
  const getCategoryColor = (catName) => {
    if (!categories || categories.length === 0) return 'bg-white text-gray-500 border-gray-200';
    
    // Find the category object that matches the task's category name
    const foundCat = categories.find(c => c.name === catName);
    
    // If found, return its color class (e.g., bg-emerald-500) + white text
    if (foundCat) {
        return `${foundCat.color} text-white border-transparent shadow-sm`;
    }
    return 'bg-white text-gray-500 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`
      group flex items-start justify-between p-5 mb-3
      rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border
      ${getPriorityStyles(task.priority, task.isComplete)}
    `}>
      
      <div className="flex items-start gap-4 flex-1">
        <button 
          onClick={() => onUpdate(task._id, { isComplete: !task.isComplete })} 
          className={`
            mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${task.isComplete ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-400 hover:border-blue-500'}
          `}
        >
          {task.isComplete && <FaCheck className="text-white text-[10px]" />}
        </button>

        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${task.isComplete ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={`text-sm mt-1 mb-2 ${task.isComplete ? 'text-gray-300' : 'text-gray-600'}`}>
                {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Priority Tag */}
            <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${getTagStyles(task.priority)}`}>
              {task.priority}
            </span>
            
            {/* Category Tag (Now Colored) */}
            {task.category && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
            )}

            {/* Due Date Tag */}
            {task.dueDate && (
                <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium border bg-white ${
                    isOverdue 
                    ? 'text-red-600 border-red-200' 
                    : 'text-gray-500 border-gray-200'
                }`}>
                    <FaCalendarAlt /> 
                    {formatDate(task.dueDate)}
                    {isOverdue && <span className="font-bold ml-1">(Overdue)</span>}
                </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all"
            title="Edit Task"
        >
            <FaEdit />
        </button>

        <button 
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all"
            title="Delete Task"
        >
            <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;