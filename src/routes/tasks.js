const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.get('/assigned', auth(['employee']), taskController.getAssignedTasks);
router.put('/complete/:id', auth(['employee']), taskController.completeTask);
router.get('/major', auth(['director', 'manager']), taskController.getMajorTasks);
router.post('/subtask', auth(['manager']), taskController.createSubTask);
router.delete('/:id', auth(['manager']), taskController.deleteTask);
router.put('/major/complete/:id', auth(['manager']), taskController.completeMajorTask);
router.post('/major', auth(['director']), taskController.createMajorTask);
router.get('/:id', auth(['director', 'manager']), taskController.getTaskDetails);

module.exports = router;