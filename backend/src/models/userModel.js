const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class UserModel {
  // Find user by email
  static async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT u.*, 
        s.id as student_id, s.institution, s.academic_level,
        t.id as tutor_id, t.bio, t.hourly_rate, t.approval_status, t.rating
       FROM users u
       LEFT JOIN students s ON u.id = s.user_id
       LEFT JOIN tutors t ON u.id = t.user_id
       WHERE u.email = ?`,
      [email]
    );
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, 
        u.phone_number, u.created_at,
        s.institution, s.academic_level, s.total_spent,
        t.bio, t.hourly_rate, t.rating, t.approval_status
       FROM users u
       LEFT JOIN students s ON u.id = s.user_id
       LEFT JOIN tutors t ON u.id = t.user_id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Create new user
  static async create(userData) {
    const {
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
    } = userData;

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert into users table
      await connection.query(
        `INSERT INTO users (id, email, password, first_name, last_name, role, phone_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, email, hashedPassword, firstName, lastName, role, phoneNumber || null]
      );

      // Insert into role-specific table
      if (role === 'student') {
        const studentId = uuidv4();
        await connection.query(
          `INSERT INTO students (id, user_id, institution, academic_level) 
           VALUES (?, ?, ?, ?)`,
          [studentId, userId, institution || null, academicLevel || 'First Year']
        );
      } else if (role === 'tutor') {
        const tutorId = uuidv4();
        await connection.query(
          `INSERT INTO tutors (id, user_id, bio, hourly_rate, approval_status) 
           VALUES (?, ?, ?, ?, ?)`,
          [tutorId, userId, bio || null, hourlyRate || null, 'pending']
        );
      }

      await connection.commit();
      return { userId, role };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Update user
  static async update(id, updateData) {
    const { firstName, lastName, phoneNumber, institution, academicLevel, bio, hourlyRate } = updateData;
    
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update users table
      const userUpdates = [];
      const userParams = [];
      
      if (firstName) {
        userUpdates.push('first_name = ?');
        userParams.push(firstName);
      }
      if (lastName) {
        userUpdates.push('last_name = ?');
        userParams.push(lastName);
      }
      if (phoneNumber !== undefined) {
        userUpdates.push('phone_number = ?');
        userParams.push(phoneNumber);
      }
      
      if (userUpdates.length > 0) {
        userParams.push(id);
        await connection.query(
          `UPDATE users SET ${userUpdates.join(', ')} WHERE id = ?`,
          userParams
        );
      }
      
      // Get user role
      const [users] = await connection.query('SELECT role FROM users WHERE id = ?', [id]);
      const userRole = users[0]?.role;
      
      // Update role-specific tables
      if (userRole === 'student' && (institution || academicLevel)) {
        const studentUpdates = [];
        const studentParams = [];
        
        if (institution) {
          studentUpdates.push('institution = ?');
          studentParams.push(institution);
        }
        if (academicLevel) {
          studentUpdates.push('academic_level = ?');
          studentParams.push(academicLevel);
        }
        
        if (studentUpdates.length > 0) {
          studentParams.push(id);
          await connection.query(
            `UPDATE students SET ${studentUpdates.join(', ')} WHERE user_id = ?`,
            studentParams
          );
        }
      }
      
      if (userRole === 'tutor' && (bio !== undefined || hourlyRate !== undefined)) {
        const tutorUpdates = [];
        const tutorParams = [];
        
        if (bio !== undefined) {
          tutorUpdates.push('bio = ?');
          tutorParams.push(bio);
        }
        if (hourlyRate !== undefined) {
          tutorUpdates.push('hourly_rate = ?');
          tutorParams.push(hourlyRate);
        }
        
        if (tutorUpdates.length > 0) {
          tutorParams.push(id);
          await connection.query(
            `UPDATE tutors SET ${tutorUpdates.join(', ')} WHERE user_id = ?`,
            tutorParams
          );
        }
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete user
  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get all users with pagination
  static async findAll(filters = {}) {
    const { role, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.phone_number, u.created_at,
        s.institution, s.academic_level,
        t.bio, t.hourly_rate, t.rating, t.approval_status
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN tutors t ON u.id = t.user_id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [users] = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = [];
    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }
    
    const [countResult] = await db.query(countQuery, countParams);
    
    return {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    };
  }

  // Get all approved tutors
  static async getApprovedTutors() {
    const [tutors] = await db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone_number,
        t.bio, t.hourly_rate, t.rating, t.total_earnings, t.total_requests_completed
       FROM users u
       INNER JOIN tutors t ON u.id = t.user_id
       WHERE t.approval_status = 'approved'
       ORDER BY t.rating DESC`
    );
    return tutors;
  }

  // Update tutor approval status
  static async updateTutorStatus(userId, status) {
    const [result] = await db.query(
      'UPDATE tutors SET approval_status = ? WHERE user_id = ?',
      [status, userId]
    );
    return result.affectedRows > 0;
  }

  // Change password
  static async changePassword(userId, hashedPassword) {
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = UserModel;