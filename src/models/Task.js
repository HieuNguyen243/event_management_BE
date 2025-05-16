const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  completed: { type: Boolean, default: false },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  subTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);