const Task = require('../models/Task');
const Note = require('../models/Note');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalTasks, completedTasks, recentTasks, recentNotes] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, isComplete: true }),
      Task.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      Note.find({ user: userId }).sort({ updatedAt: -1 }).limit(3)
    ]);

    res.json({
      totalTasks,
      completedTasks,
      recentTasks,
      recentNotes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};