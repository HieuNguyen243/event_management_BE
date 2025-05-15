const Task = require('../models/Task');
const Event = require('../models/event');

const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId })
      .populate('assignedTo', 'username name employeeCode') // Thêm name
      .populate('eventId', 'eventName');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const completeTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, assignedTo: req.user.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or not assigned to you' });
    }
    task.completed = true;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getMajorTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user.userId, parentTask: null })
      .populate('assignedTo', 'username name employeeCode') // Thêm name
      .populate('eventId', 'eventName');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createSubTask = async (req, res) => {
  const { parentTaskId, title, description, deadline, assignedTo } = req.body;
  if (!parentTaskId || !title || !assignedTo) {
    return res.status(400).json({ error: 'ParentTaskId, title, and assignedTo are required' });
  }

  try {
    const parentTask = await Task.findOne({ _id: parentTaskId, assignedBy: req.user.userId });
    if (!parentTask) {
      return res.status(404).json({ error: 'Parent task not found' });
    }

    const task = new Task({
      title,
      description,
      deadline,
      assignedTo,
      assignedBy: req.user.userId,
      parentTask: parentTaskId,
      eventId: parentTask.eventId,
    });
    await task.save();

    parentTask.subTasks.push(task._id);
    await parentTask.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, assignedBy: req.user.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await Task.deleteOne({ _id: id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const completeMajorTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, assignedBy: req.user.userId, parentTask: null });
    if (!task) {
      return res.status(404).json({ error: 'Major task not found' });
    }

    const subTasks = await Task.find({ parentTask: id });
    const allCompleted = subTasks.every(subTask => subTask.completed);
    if (!allCompleted) {
      return res.status(400).json({ error: 'Not all subtasks are completed' });
    }

    task.completed = true;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createMajorTask = async (req, res) => {
  const { title, description, deadline, assignedTo, eventId } = req.body;
  if (!title || !assignedTo || !eventId) {
    return res.status(400).json({ error: 'Title, assignedTo, and eventId are required' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const task = new Task({
      title,
      description,
      deadline,
      assignedTo,
      assignedBy: req.user.userId,
      eventId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getTaskDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, assignedBy: req.user.userId })
      .populate('assignedTo', 'username name employeeCode') // Thêm name
      .populate('eventId', 'eventName')
      .populate({
        path: 'subTasks',
        populate: [
          { path: 'assignedTo', select: 'username name employeeCode' }, // Thêm name
          { path: 'notes', populate: { path: 'userId', select: 'username name' } }, // Thêm name
        ],
      });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAssignedTasks,
  completeTask,
  getMajorTasks,
  createSubTask,
  deleteTask,
  completeMajorTask,
  createMajorTask,
  getTaskDetails,
};