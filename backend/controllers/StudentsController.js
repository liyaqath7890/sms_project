import pool from '../config/database.js';

class StudentsController {
  static async getAllStudents(req, res) {
    try {
      const { page = 1, limit = 50, search, division_id, standard_id } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let where = [];
      let params = [];
      let i = 1;

      if (search) {
        where.push(`(s.first_name ILIKE $${i} OR s.last_name ILIKE $${i} OR s.admission_number ILIKE $${i})`);
        params.push(`%${search}%`);
        i++;
      }
      if (division_id) { where.push(`s.division_id = $${i++}`); params.push(division_id); }
      if (standard_id) { where.push(`d.standard_id = $${i++}`); params.push(standard_id); }

      const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

      const [rows, countResult] = await Promise.all([
        pool.query(
          `SELECT s.*, d.name as division_name, st.name as standard_name
           FROM students s
           LEFT JOIN divisions d ON s.division_id = d.id
           LEFT JOIN standards st ON d.standard_id = st.id
           ${whereClause}
           ORDER BY s.created_at DESC
           LIMIT $${i} OFFSET $${i + 1}`,
          [...params, parseInt(limit), offset]
        ),
        pool.query(
          `SELECT COUNT(*) FROM students s LEFT JOIN divisions d ON s.division_id = d.id ${whereClause}`,
          params
        )
      ]);

      res.json({
        students: rows.rows.map(s => ({
          ...s,
          name: `${s.first_name} ${s.last_name}`,
          rollNumber: s.admission_number,
          attendance: 94,
        })),
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        totalPages: Math.ceil(countResult.rows[0].count / limit)
      });
    } catch (error) {
      console.error('getAllStudents error:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  }

  static async getStudentById(req, res) {
    try {
      const result = await pool.query(
        `SELECT s.*, d.name as division_name, st.name as standard_name
         FROM students s
         LEFT JOIN divisions d ON s.division_id = d.id
         LEFT JOIN standards st ON d.standard_id = st.id
         WHERE s.id = $1`,
        [req.params.id]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Student not found' });
      const s = result.rows[0];
      res.json({ ...s, name: `${s.first_name} ${s.last_name}` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch student' });
    }
  }

  static async createStudent(req, res) {
    try {
      const {
        firstName, lastName, first_name, last_name,
        email, phone, gender, address,
        parentName, parent_name, parentPhone, parent_phone,
        dateOfBirth, date_of_birth,
        admissionNumber, admission_number,
        division_id
      } = req.body;

      const fName = firstName || first_name || '';
      const lName = lastName || last_name || '';
      const dob = dateOfBirth || date_of_birth || '2000-01-01';
      const admNo = admissionNumber || admission_number || `ADM${Date.now()}`;
      const genderVal = (gender || 'male').toLowerCase();

      if (!fName || !lName) {
        return res.status(400).json({ error: 'First name and last name are required' });
      }

      const result = await pool.query(
        `INSERT INTO students (first_name, last_name, email, phone, gender, address,
          parent_name, parent_phone, date_of_birth, admission_number, division_id, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true) RETURNING *`,
        [fName, lName, email || null, phone || null,
         ['male','female','other'].includes(genderVal) ? genderVal : 'male',
         address || null, parentName || parent_name || null,
         parentPhone || parent_phone || null, dob, admNo, division_id || null]
      );

      const s = result.rows[0];
      res.status(201).json({ ...s, name: `${s.first_name} ${s.last_name}` });
    } catch (error) {
      console.error('createStudent error:', error);
      if (error.code === '23505') return res.status(409).json({ error: 'Admission number already exists' });
      res.status(500).json({ error: 'Failed to create student' });
    }
  }

  static async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const {
        firstName, lastName, first_name, last_name,
        email, phone, gender, address,
        parentName, parent_name, parentPhone, parent_phone,
        division_id
      } = req.body;

      const result = await pool.query(
        `UPDATE students SET
          first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          gender = COALESCE($5, gender),
          address = COALESCE($6, address),
          parent_name = COALESCE($7, parent_name),
          parent_phone = COALESCE($8, parent_phone),
          division_id = COALESCE($9, division_id),
          updated_at = NOW()
         WHERE id = $10 RETURNING *`,
        [firstName || first_name || null, lastName || last_name || null,
         email || null, phone || null, gender || null, address || null,
         parentName || parent_name || null, parentPhone || parent_phone || null,
         division_id || null, id]
      );

      if (!result.rows[0]) return res.status(404).json({ error: 'Student not found' });
      const s = result.rows[0];
      res.json({ ...s, name: `${s.first_name} ${s.last_name}` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update student' });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING id', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Student not found' });
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete student' });
    }
  }

  static async getStats(req, res) {
    try {
      const result = await pool.query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE is_active = true) as active,
          COUNT(*) FILTER (WHERE gender = 'male') as male,
          COUNT(*) FILTER (WHERE gender = 'female') as female
        FROM students
      `);
      res.json({ stats: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

export default StudentsController;
