const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.post('/', auth(['director']), eventController.createEvent);
router.get('/', auth(['director']), eventController.getEvents);
router.get('/search', auth(['director']), eventController.searchEvents);
router.get('/:id', auth(['director']), eventController.getEventById);
router.put('/:id', auth(['director']), eventController.updateEvent);
router.delete('/:id', auth(['director']), eventController.deleteEvent);

module.exports = router;