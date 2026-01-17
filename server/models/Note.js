const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'Personal' },
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);