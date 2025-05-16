const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');

router.post('/', auth(['employee']), noteController.createNote);
router.get('/task/:taskId', auth(['employee']), noteController.getNotesByTask);

module.exports = router;