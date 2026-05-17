const jwt = require('jsonwebtoken');
const db = require('../config/database');

class TokenService {
  static generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
    
    return { accessToken, refreshToken };
  }

  static async refreshAccessToken(refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const [users] = await db.query('SELECT role FROM users WHERE id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      throw new Error('User not found');
    }
    
    const accessToken = jwt.sign(
      { userId: decoded.userId, role: users[0].role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
    
    return { accessToken };
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = TokenService;