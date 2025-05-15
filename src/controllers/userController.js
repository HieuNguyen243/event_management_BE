const bcrypt = require('bcryptjs');
const User = require('../models/User');

const addEmployee = async (req, res) => {
  const { username, password, employeeCode, name, email, phone } = req.body;
  if (!username || !password || !employeeCode || !name) {
    return res.status(400).json({ error: 'Username, password, employeeCode, and name are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { employeeCode }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or employeeCode already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      employeeCode,
      role: 'employee',
      name,
      email,
      phone,
    });
    await user.save();
    res.status(201).json({ username, employeeCode, role: user.role, name, email, phone });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteEmployee = async (req, res) => {
  const { employeeCode } = req.params;
  try {
    const user = await User.findOneAndDelete({ employeeCode, role: 'employee' });
    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const searchEmployee = async (req, res) => {
  const { employeeCode } = req.query;
  try {
    const user = await User.findOne({ employeeCode, role: 'employee' });
    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ username: user.username, employeeCode: user.employeeCode, role: user.role, name: user.name, email: user.email, phone: user.phone });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addManager = async (req, res) => {
  const { username, password, employeeCode, name, email, phone } = req.body;
  if (!username || !password || !employeeCode || !name) {
    return res.status(400).json({ error: 'Username, password, employeeCode, and name are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { employeeCode }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or employeeCode already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      employeeCode,
      role: 'manager',
      name,
      email,
      phone,
    });
    await user.save();
    res.status(201).json({ username, employeeCode, role: user.role, name, email, phone });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteManager = async (req, res) => {
  const { employeeCode } = req.params;
  try {
    const user = await User.findOneAndDelete({ employeeCode, role: 'manager' });
    if (!user) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const searchManager = async (req, res) => {
  const { employeeCode } = req.query;
  try {
    const user = await User.findOne({ employeeCode, role: 'manager' });
    if (!user) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.json({ username: user.username, employeeCode: user.employeeCode, role: user.role, name: user.name, email: user.email, phone: user.phone });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addEmployee,
  deleteEmployee,
  searchEmployee,
  addManager,
  deleteManager,
  searchManager,
};