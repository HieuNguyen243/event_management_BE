const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/employee', auth(['director']), userController.addEmployee);
router.delete('/employee/:employeeCode', auth(['director']), userController.deleteEmployee);
router.get('/employee/search', auth(['director']), userController.searchEmployee);
router.post('/manager', auth(['director']), userController.addManager);
router.delete('/manager/:employeeCode', auth(['director']), userController.deleteManager);
router.get('/manager/search', auth(['director']), userController.searchManager);

module.exports = router;