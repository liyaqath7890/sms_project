import AttendanceRepository from '../repositories/AttendanceRepository.js';

class AttendanceService {
  static async getAttendance(query) {
    const { page = 1, limit = 10, ...filters } = query;
    const numericPage = parseInt(page, 10);
    const numericLimit = parseInt(limit, 10);
    const offset = (numericPage - 1) * numericLimit;
    const { rows, total } = await AttendanceRepository.fetchAttendance({
      offset,
      limit: numericLimit,
      ...filters
    });

    return {
      attendance: rows,
      pagination: {
        page: numericPage,
        limit: numericLimit,
        total,
        pages: Math.ceil(total / numericLimit)
      }
    };
  }

  static async markAttendance(payload, user) {
    const { division_id, subject_id, date, attendance_records } = payload;

    if (!division_id || !subject_id || !date || !attendance_records) {
      const error = new Error('Division, subject, date, and attendance records are required');
      error.statusCode = 400;
      throw error;
    }

    let sessionId = payload.academic_session_id;
    if (!sessionId) {
      sessionId = await AttendanceRepository.fetchActiveSessionId();
    }

    let teacherId = payload.teacher_id;
    if (!teacherId && user.role === 'teacher') {
      teacherId = await AttendanceRepository.fetchTeacherIdByUserId(user.id);
    }

    await AttendanceRepository.markClassAttendance({
      division_id,
      subject_id,
      teacher_id: teacherId,
      date,
      academic_session_id: sessionId,
      attendance_records
    });
  }

  static async getStudentAttendance(studentId, query) {
    const attendance = await AttendanceRepository.fetchStudentAttendance(studentId, query);
    const totalDays = attendance.length;
    const presentDays = attendance.filter(record => record.status === 'present').length;
    const absentDays = attendance.filter(record => record.status === 'absent').length;
    const lateDays = attendance.filter(record => record.status === 'late').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays + lateDays * 0.5) / totalDays * 100).toFixed(2) : 0;

    return {
      attendance,
      statistics: {
        total_days: totalDays,
        present_days: presentDays,
        absent_days: absentDays,
        late_days: lateDays,
        attendance_percentage: attendancePercentage
      }
    };
  }

  static async getDivisionStats(divisionId, query) {
    const stats = await AttendanceRepository.fetchDivisionStats(divisionId, query);
    const attendanceRate = stats.total_records > 0
      ? (((stats.present_count + stats.late_count * 0.5) / stats.total_records) * 100).toFixed(2)
      : 0;

    return {
      stats: {
        ...stats,
        attendance_rate: attendanceRate
      }
    };
  }

  static async updateAttendance(id, payload) {
    return AttendanceRepository.updateAttendance(id, payload);
  }
}

export default AttendanceService;
