const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class UserController {
  // Get all users (admin only)
  static async getAllUsers(req, res, next) {
    try {
      const { role, page, limit } = req.query;
      const result = await UserModel.findAll({ role, page, limit });
      
      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      
      // Check authorization
      if (req.userRole !== 'admin' && req.userId !== id) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Check authorization
      if (req.userRole !== 'admin' && req.userId !== id) {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
      
      await UserModel.update(id, updateData);
      
      res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Delete user (admin only)
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      
      const deleted = await UserModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Get all approved tutors
  static async getTutors(req, res, next) {
    try {
      const tutors = await UserModel.getApprovedTutors();
      res.json({ success: true, data: tutors });
    } catch (error) {
      next(error);
    }
  }

  // Approve tutor (admin only)
  static async approveTutor(req, res, next) {
    try {
      const { id } = req.params;
      
      const updated = await UserModel.updateTutorStatus(id, 'approved');
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Tutor not found' });
      }
      
      res.json({ success: true, message: 'Tutor approved successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Reject tutor (admin only)
  static async rejectTutor(req, res, next) {
    try {
      const { id } = req.params;
      
      const updated = await UserModel.updateTutorStatus(id, 'rejected');
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Tutor not found' });
      }
      
      res.json({ success: true, message: 'Tutor rejected successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Create tutor (admin only)
  static async createTutor(req, res, next) {
    try {
      const { email, password, firstName, lastName, phoneNumber, bio, hourlyRate, subjects } = req.body;
      
      // Check if email exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      
      const connection = await db.getConnection();
      await connection.beginTransaction();
      
      try {
        await connection.query(
          `INSERT INTO users (id, email, password, first_name, last_name, role, phone_number) 
           VALUES (?, ?, ?, ?, ?, 'tutor', ?)`,
          [userId, email, hashedPassword, firstName, lastName, phoneNumber || null]
        );
        
        const tutorId = uuidv4();
        await connection.query(
          `INSERT INTO tutors (id, user_id, bio, hourly_rate, approval_status, subjects) 
           VALUES (?, ?, ?, ?, 'approved', ?)`,
          [tutorId, userId, bio || null, hourlyRate || null, subjects || null]
        );
        
        await connection.commit();
        
        res.status(201).json({ 
          success: true, 
          message: 'Tutor created successfully',
          data: { userId, tutorId }
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;