const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');
const Task = require('../models/Task');
const Note = require('../models/Note');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'event_management' });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Event.deleteMany({});
    await Task.deleteMany({});
    await Note.deleteMany({});

    // Tạo người dùng mẫu
    const hashedPassword = await bcrypt.hash('password123', 10);

    const director = new User({
      username: 'director1',
      password: hashedPassword,
      employeeCode: 'D001',
      role: 'director',
      name: 'Nguyen Van A',
      email: 'director@example.com',
      phone: '0901234567',
    });

    const manager = new User({
      username: 'manager1',
      password: hashedPassword,
      employeeCode: 'M001',
      role: 'manager',
      name: 'Tran Thi B',
      email: 'manager@example.com',
      phone: '0907654321',
    });

    const employee = new User({
      username: 'employee1',
      password: hashedPassword,
      employeeCode: 'E001',
      role: 'employee',
      name: 'Le Van C',
      email: 'employee@example.com',
      phone: '0901112233',
    });

    await director.save();
    await manager.save();
    await employee.save();

    // Tạo sự kiện mẫu
    const event = new Event({
      eventName: 'Sự kiện lớn 2025',
      start_date: new Date('2025-06-01'),
      end_date: new Date('2025-06-10'),
      location: 'Hội trường lớn',
      scale: 'lớn',
      createdBy: director._id,
    });

    await event.save();

    // Tạo nhiệm vụ lớn (Major Task) bởi Đạo diễn
    const majorTask = new Task({
      title: 'Tổ chức sự kiện lớn',
      description: 'Chuẩn bị và thực hiện sự kiện',
      deadline: new Date('2025-06-05'),
      completed: false,
      assignedBy: director._id,
      eventId: event._id,
    });

    await majorTask.save();

    // Tạo nhiệm vụ con (Sub Task) bởi Quản lý nhóm
    const subTask = new Task({
      title: 'Thiết kế sân khấu',
      description: 'Thiết kế và lắp đặt sân khấu',
      deadline: new Date('2025-06-03'),
      completed: false,
      assignedTo: employee._id,
      assignedBy: manager._id,
      parentTask: majorTask._id,
      eventId: event._id,
    });

    await subTask.save();

    // Tạo ghi chú bởi Nhân viên
    const note = new Note({
      content: 'Đã hoàn thành bản thiết kế sân khấu',
      taskId: subTask._id,
      userId: employee._id,
    });

    await note.save();
    subTask.notes.push(note._id);
    await subTask.save();

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);