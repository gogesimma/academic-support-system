const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class RequestModel {
  // Create new request
  static async create(requestData) {
    const {
      studentId,
      title,
      description,
      serviceTypeId,
      moduleId,
      deadline,
      priority,
      attachments
    } = requestData;

    const requestId = uuidv4();
    
    await db.query(
      `INSERT INTO requests (id, student_id, title, description, service_type_id, module_id, deadline, priority, attachments) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [requestId, studentId, title, description, serviceTypeId || null, moduleId || null, deadline || null, priority || 'medium', JSON.stringify(attachments || [])]
    );
    
    return requestId;
  }

  // Get request by ID with details
  static async findById(id) {
    const [rows] = await db.query(
      `SELECT r.*, 
        st.name as service_type_name,
        m.name as module_name,
        CONCAT(u.first_name, ' ', u.last_name) as student_name,
        CONCAT(tu.first_name, ' ', tu.last_name) as tutor_name,
        u.email as student_email,
        tu.email as tutor_email
       FROM requests r
       LEFT JOIN service_types st ON r.service_type_id = st.id
       LEFT JOIN modules m ON r.module_id = m.id
       LEFT JOIN students s ON r.student_id = s.id
       LEFT JOIN users u ON s.user_id = u.id
       LEFT JOIN tutors t ON r.assigned_tutor_id = t.id
       LEFT JOIN users tu ON t.user_id = tu.id
       WHERE r.id = ?`,
      [id]
    );
    return rows[0];
  }

  // Get requests with filters
  static async findAll(filters = {}) {
    const { studentId, tutorId, status, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT r.*, 
        st.name as service_type_name,
        m.name as module_name,
        CONCAT(u.first_name, ' ', u.last_name) as student_name,
        CONCAT(tu.first_name, ' ', tu.last_name) as tutor_name
      FROM requests r
      LEFT JOIN service_types st ON r.service_type_id = st.id
      LEFT JOIN modules m ON r.module_id = m.id
      LEFT JOIN students s ON r.student_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN tutors t ON r.assigned_tutor_id = t.id
      LEFT JOIN users tu ON t.user_id = tu.id
      WHERE 1=1
    `;
    const params = [];
    
    if (studentId) {
      query += ' AND r.student_id = ?';
      params.push(studentId);
    }
    
    if (tutorId) {
      query += ' AND r.assigned_tutor_id = ?';
      params.push(tutorId);
    }
    
    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [requests] = await db.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM requests r WHERE 1=1';
    const countParams = [];
    
    if (studentId) {
      countQuery += ' AND r.student_id = ?';
      countParams.push(studentId);
    }
    if (tutorId) {
      countQuery += ' AND r.assigned_tutor_id = ?';
      countParams.push(tutorId);
    }
    if (status) {
      countQuery += ' AND r.status = ?';
      countParams.push(status);
    }
    
    const [countResult] = await db.query(countQuery, countParams);
    
    return {
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    };
  }

  // Update request status
  static async updateStatus(id, status) {
    const [result] = await db.query(
      'UPDATE requests SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  // Assign tutor to request
  static async assignTutor(requestId, tutorId) {
    const [result] = await db.query(
      'UPDATE requests SET assigned_tutor_id = ?, status = ? WHERE id = ?',
      [tutorId, 'assigned', requestId]
    );
    return result.affectedRows > 0;
  }

  // Submit work
  static async submitWork(requestId, tutorId, fileUrl, notes) {
    const submissionId = uuidv4();
    
    const connection = await db.getConnection();
    await connection.beginTransaction();
    
    try {
      await connection.query(
        `INSERT INTO work_submissions (id, request_id, tutor_id, file_url, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [submissionId, requestId, tutorId, fileUrl, notes || null]
      );
      
      await connection.query(
        'UPDATE requests SET status = ? WHERE id = ?',
        ['completed', requestId]
      );
      
      await connection.query(
        'UPDATE tutors SET total_requests_completed = total_requests_completed + 1 WHERE id = ?',
        [tutorId]
      );
      
      await connection.commit();
      return submissionId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get requests by student
  static async findByStudent(studentId, filters = {}) {
    return this.findAll({ ...filters, studentId });
  }

  // Get requests by tutor
  static async findByTutor(tutorId, filters = {}) {
    return this.findAll({ ...filters, tutorId });
  }
}

module.exports = RequestModel;