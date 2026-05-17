const RequestModel = require('../models/RequestModel');
const UserModel = require('../models/UserModel');

class RequestController {
  // Create new request (student only)
  static async createRequest(req, res, next) {
    try {
      const { title, description, serviceTypeId, moduleId, deadline, priority, attachments } = req.body;
      
      // Get student ID
      const user = await UserModel.findById(req.userId);
      if (!user || user.role !== 'student') {
        return res.status(404).json({ success: false, error: 'Student profile not found' });
      }
      
      const studentId = user.student_id;
      
      const requestId = await RequestModel.create({
        studentId,
        title,
        description,
        serviceTypeId,
        moduleId,
        deadline,
        priority,
        attachments
      });
      
      const created = await RequestModel.findById(requestId);
      
      res.status(201).json({ success: true, data: created });
    } catch (error) {
      next(error);
    }
  }

  // Get all requests (with role-based filtering)
  static async getAllRequests(req, res, next) {
    try {
      const { status, page, limit } = req.query;
      let { studentId, tutorId } = req.query;
      
      // Role-based filtering
      if (req.userRole === 'student') {
        const user = await UserModel.findById(req.userId);
        studentId = user.student_id;
      } else if (req.userRole === 'tutor') {
        const user = await UserModel.findById(req.userId);
        tutorId = user.tutor_id;
      }
      
      const result = await RequestModel.findAll({
        studentId,
        tutorId,
        status,
        page,
        limit
      });
      
      res.json({
        success: true,
        data: result.requests,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get request by ID
  static async getRequestById(req, res, next) {
    try {
      const { id } = req.params;
      
      const request = await RequestModel.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, error: 'Request not found' });
      }
      
      // Check authorization
      const user = await UserModel.findById(req.userId);
      if (req.userRole === 'student' && request.student_id !== user.student_id) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      if (req.userRole === 'tutor' && request.assigned_tutor_id !== user.tutor_id) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      res.json({ success: true, data: request });
    } catch (error) {
      next(error);
    }
  }

  // Assign tutor to request (admin only)
  static async assignTutor(req, res, next) {
    try {
      const { id } = req.params;
      const { tutorId } = req.body;
      
      // Check if tutor exists and is approved
      const tutor = await UserModel.findById(tutorId);
      if (!tutor || tutor.role !== 'tutor' || tutor.approval_status !== 'approved') {
        return res.status(404).json({ success: false, error: 'Tutor not found or not approved' });
      }
      
      const assigned = await RequestModel.assignTutor(id, tutorId);
      if (!assigned) {
        return res.status(404).json({ success: false, error: 'Request not found' });
      }
      
      res.json({ success: true, message: 'Tutor assigned successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Update request status
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const validStatuses = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }
      
      // Check authorization
      const request = await RequestModel.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, error: 'Request not found' });
      }
      
      const user = await UserModel.findById(req.userId);
      
      if (req.userRole === 'student') {
        if (request.student_id !== user.student_id) {
          return res.status(403).json({ success: false, error: 'Access denied' });
        }
        if (status !== 'cancelled') {
          return res.status(403).json({ success: false, error: 'Students can only cancel requests' });
        }
      } else if (req.userRole === 'tutor') {
        if (request.assigned_tutor_id !== user.tutor_id) {
          return res.status(403).json({ success: false, error: 'Access denied' });
        }
        if (!['in_progress', 'completed'].includes(status)) {
          return res.status(403).json({ success: false, error: 'Tutors can only update to in_progress or completed' });
        }
      }
      
      await RequestModel.updateStatus(id, status);
      
      res.json({ success: true, message: 'Request status updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Submit work (tutor only)
  static async submitWork(req, res, next) {
    try {
      const { id } = req.params;
      const { fileUrl, notes } = req.body;
      
      // Get tutor ID
      const user = await UserModel.findById(req.userId);
      if (!user || user.role !== 'tutor') {
        return res.status(404).json({ success: false, error: 'Tutor profile not found' });
      }
      
      const tutorId = user.tutor_id;
      
      // Check if tutor is assigned to this request
      const request = await RequestModel.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, error: 'Request not found' });
      }
      
      if (request.assigned_tutor_id !== tutorId) {
        return res.status(403).json({ success: false, error: 'You are not assigned to this request' });
      }
      
      if (request.status === 'completed') {
        return res.status(400).json({ success: false, error: 'Request already completed' });
      }
      
      const submissionId = await RequestModel.submitWork(id, tutorId, fileUrl, notes);
      
      res.json({ success: true, data: { id: submissionId } });
    } catch (error) {
      next(error);
    }
  }

  // Get service types
  static async getServiceTypes(req, res, next) {
    try {
      const db = require('../config/database');
      const [serviceTypes] = await db.query('SELECT * FROM service_types ORDER BY sort_order');
      res.json({ success: true, data: serviceTypes });
    } catch (error) {
      next(error);
    }
  }

  // Get modules
  static async getModules(req, res, next) {
    try {
      const db = require('../config/database');
      const [modules] = await db.query('SELECT * FROM modules ORDER BY sort_order');
      res.json({ success: true, data: modules });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RequestController;