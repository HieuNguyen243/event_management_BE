const Event = require('../models/event');

const createEvent = async (req, res) => {
  const { eventName, start_date, end_date, location, scale } = req.body;
  if (!eventName || !start_date || !end_date || !location || !scale) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const event = new Event({
      eventName,
      start_date,
      end_date,
      location,
      scale,
      createdBy: req.user.userId,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({ _id: id, createdBy: req.user.userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { eventName, start_date, end_date, location, scale } = req.body;
  try {
    const event = await Event.findOne({ _id: id, createdBy: req.user.userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (eventName) event.eventName = eventName;
    if (start_date) event.start_date = start_date;
    if (end_date) event.end_date = end_date;
    if (location) event.location = location;
    if (scale) event.scale = scale;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOneAndDelete({ _id: id, createdBy: req.user.userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const searchEvents = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const events = await Event.find({
      createdBy: req.user.userId,
      $or: [
        { eventName: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { scale: { $regex: query, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent, searchEvents };