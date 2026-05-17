const express = require('express');
const UserController = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, requireRole('admin'), UserController.getAllUsers);
router.get('/tutors', authMiddleware, UserController.getTutors);
router.get('/:id', authMiddleware, UserController.getUserById);
router.patch('/:id', authMiddleware, UserController.updateUser);
router.delete('/:id', authMiddleware, requireRole('admin'), UserController.deleteUser);
router.patch('/tutors/:id/approve', authMiddleware, requireRole('admin'), UserController.approveTutor);
router.patch('/tutors/:id/reject', authMiddleware, requireRole('admin'), UserController.rejectTutor);
router.post('/tutors', authMiddleware, requireRole('admin'), UserController.createTutor);

module.exports = router;