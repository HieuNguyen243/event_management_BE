const Note = require('../models/Note');
const Task = require('../models/Task');

const createNote = async (req, res) => {
  const { taskId, content } = req.body;
  if (!taskId || !content) {
    return res.status(400).json({ error: 'TaskId and content are required' });
  }

  try {
    const task = await Task.findOne({ _id: taskId, assignedTo: req.user.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or not assigned to you' });
    }

    const note = new Note({
      content,
      taskId,
      userId: req.user.userId,
    });
    await note.save();

    task.notes.push(note._id);
    await task.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getNotesByTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findOne({ _id: taskId, assignedTo: req.user.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or not assigned to you' });
    }

    const notes = await Note.find({ taskId }).populate('userId', 'username name'); // Thêm name
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createNote, getNotesByTask };