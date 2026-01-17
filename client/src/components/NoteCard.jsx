import React from 'react';
import { FaTrash, FaEdit, FaThumbtack } from 'react-icons/fa';

const NoteCard = ({ note, onDelete, onEdit, onPin }) => {
  return (
    <div className={`
      flex flex-col justify-between h-64 p-6 
      rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md 
      ${note.isPinned ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}
    `}>
      
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-gray-800 truncate pr-3">{note.title}</h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onPin(note); }} 
            className={`text-lg transition-colors ${note.isPinned ? 'text-orange-500' : 'text-gray-300 hover:text-orange-400'}`}
            title={note.isPinned ? "Unpin" : "Pin to top"}
          >
            <FaThumbtack />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm whitespace-pre-wrap overflow-hidden h-24 leading-relaxed">
          {note.content}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200/50">
        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-lg uppercase tracking-wide">
          {note.category}
        </span>
        
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(note); }} 
            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
            title="Edit Note"
          >
            <FaEdit />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(note._id); }} 
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Note"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;