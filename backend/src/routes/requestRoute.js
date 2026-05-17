const express = require('express');
const RequestController = require('../controllers/requestController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { validate, requestValidation } = require('../middleware/validation');

const router = express.Router();

router.get('/service-types', authMiddleware, RequestController.getServiceTypes);
router.get('/modules', authMiddleware, RequestController.getModules);
router.post('/', authMiddleware, requireRole('student'), requestValidation.create, validate, RequestController.createRequest);
router.get('/', authMiddleware, RequestController.getAllRequests);
router.get('/:id', authMiddleware, RequestController.getRequestById);
router.patch('/:id/assign', authMiddleware, requireRole('admin'), requestValidation.assign, validate, RequestController.assignTutor);
router.patch('/:id/status', authMiddleware, RequestController.updateStatus);
router.post('/:id/submit-work', authMiddleware, requireRole('tutor'), requestValidation.submitWork, validate, RequestController.submitWork);

module.exports = router;