const UserModel = require('../models/userModel');
const TokenService = require('../services/tokenService');
const bcrypt = require('bcryptjs');

class AuthController {
  // Register new user
  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName, role, phoneNumber, institution, academicLevel, bio, hourlyRate } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      // Create user
      const { userId, role: userRole } = await UserModel.create({
        email,
        password,
        firstName,
        lastName,
        role,
        phoneNumber,
        institution,
        academicLevel,
        bio,
        hourlyRate
      });

      // Generate tokens
      const tokens = TokenService.generateTokens(userId, userRole);
      
      // Get user data
      const user = await UserModel.findById(userId);

      res.status(201).json({
        success: true,
        data: { user, tokens }
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      // Check tutor approval status
      if (user.role === 'tutor' && user.approval_status !== 'approved') {
        return res.status(403).json({ 
          success: false, 
          error: user.approval_status === 'pending' 
            ? 'Your tutor application is pending approval.' 
            : 'Your tutor application has been rejected.' 
        });
      }

      // Generate tokens
      const tokens = TokenService.generateTokens(user.id, user.role);

      // Remove password from response
      delete user.password;

      res.json({
        success: true,
        data: { user, tokens }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  static async getMe(req, res, next) {
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ success: false, error: 'Refresh token required' });
      }

      const tokens = await TokenService.refreshAccessToken(refreshToken);
      
      res.json({ success: true, data: tokens });
    } catch (error) {
      if (error.message === 'Invalid or expired refresh token') {
        return res.status(401).json({ success: false, error: error.message });
      }
      next(error);
    }
  }

  // Logout
  static async logout(req, res, next) {
    try {
      // In a production app, you might want to blacklist the token
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Change password
  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, error: 'Current password and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
      }

      // Get current user
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      // Get user with password
      const [users] = await db.query('SELECT password FROM users WHERE id = ?', [req.userId]);
      
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, users[0].password);
      if (!isValid) {
        return res.status(401).json({ success: false, error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      await UserModel.changePassword(req.userId, hashedPassword);

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;