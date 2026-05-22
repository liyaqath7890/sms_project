import pool from '../config/database.js';

class TeachersController {
  static async getAllTeachers(req, res) {
    try {
      const { page = 1, limit = 50, search } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let where = [];
      let params = [];
      let i = 1;

      if (search) {
        where.push(`(t.first_name ILIKE $${i} OR t.last_name ILIKE $${i} OR t.employee_id ILIKE $${i})`);
        params.push(`%${search}%`);
        i++;
      }

      const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

      const [rows, countResult] = await Promise.all([
        pool.query(
          `SELECT t.* FROM teachers t ${whereClause}
           ORDER BY t.created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
          [...params, parseInt(limit), offset]
        ),
        pool.query(`SELECT COUNT(*) FROM teachers t ${whereClause}`, params)
      ]);

      res.json({
        teachers: rows.rows.map(t => ({
          ...t,
          name: `${t.first_name} ${t.last_name}`,
          experience: t.experience_years,
        })),
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        totalPages: Math.ceil(countResult.rows[0].count / limit)
      });
    } catch (error) {
      console.error('getAllTeachers error:', error);
      res.status(500).json({ error: 'Failed to fetch teachers' });
    }
  }

  static async getTeacherById(req, res) {
    try {
      const result = await pool.query('SELECT * FROM teachers WHERE id = $1', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Teacher not found' });
      const t = result.rows[0];
      res.json({ ...t, name: `${t.first_name} ${t.last_name}` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch teacher' });
    }
  }

  static async createTeacher(req, res) {
    try {
      const {
        firstName, lastName, first_name, last_name,
        email, phone, gender, address,
        subject, qualification, experience, experience_years,
        designation, joiningDate, joining_date,
        dateOfBirth, date_of_birth,
        employeeId, employee_id
      } = req.body;

      const fName = firstName || first_name || '';
      const lName = lastName || last_name || '';
      const dob = dateOfBirth || date_of_birth || '1980-01-01';
      const empId = employeeId || employee_id || `EMP${Date.now()}`;
      const genderVal = (gender || 'male').toLowerCase();

      if (!fName || !lName) {
        return res.status(400).json({ error: 'First name and last name are required' });
      }

      const result = await pool.query(
        `INSERT INTO teachers (first_name, last_name, email, phone, gender, address,
          qualification, experience_years, joining_date, date_of_birth, employee_id, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true) RETURNING *`,
        [fName, lName, email || null, phone || null,
         ['male','female','other'].includes(genderVal) ? genderVal : 'male',
         address || null, qualification || subject || designation || null,
         parseInt(experience || experience_years || 0),
         joiningDate || joining_date || new Date().toISOString().split('T')[0],
         dob, empId]
      );

      const t = result.rows[0];
      res.status(201).json({ ...t, name: `${t.first_name} ${t.last_name}` });
    } catch (error) {
      console.error('createTeacher error:', error);
      if (error.code === '23505') return res.status(409).json({ error: 'Employee ID already exists' });
      res.status(500).json({ error: 'Failed to create teacher' });
    }
  }

  static async updateTeacher(req, res) {
    try {
      const { id } = req.params;
      const {
        firstName, lastName, first_name, last_name,
        email, phone, gender, address,
        qualification, experience, experience_years
      } = req.body;

      const result = await pool.query(
        `UPDATE teachers SET
          first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          email = COALESCE($3, email),
          phone = COALESCE($4, phone),
          gender = COALESCE($5, gender),
          address = COALESCE($6, address),
          qualification = COALESCE($7, qualification),
          experience_years = COALESCE($8, experience_years),
          updated_at = NOW()
         WHERE id = $9 RETURNING *`,
        [firstName || first_name || null, lastName || last_name || null,
         email || null, phone || null, gender || null, address || null,
         qualification || null,
         experience !== undefined ? parseInt(experience) : (experience_years !== undefined ? parseInt(experience_years) : null),
         id]
      );

      if (!result.rows[0]) return res.status(404).json({ error: 'Teacher not found' });
      const t = result.rows[0];
      res.json({ ...t, name: `${t.first_name} ${t.last_name}` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update teacher' });
    }
  }

  static async deleteTeacher(req, res) {
    try {
      const result = await pool.query('DELETE FROM teachers WHERE id = $1 RETURNING id', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Teacher not found' });
      res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete teacher' });
    }
  }

  static async getStats(req, res) {
    try {
      const result = await pool.query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE is_active = true) as active,
          AVG(experience_years) as avg_experience
        FROM teachers
      `);
      res.json({ stats: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

export default TeachersController;
