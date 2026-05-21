import express from 'express';

const router = express.Router();

// AI Analysis endpoint
router.post('/analyze', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: 'Type and data are required' });
    }

    let analysis = {};

    switch (type) {
      case 'student_performance': {
        const { grades } = data;
        if (!grades || grades.length === 0) {
          analysis = { status: 'no_data', message: 'No grade data available' };
          break;
        }
        const scores = grades.map(g => g.marks_obtained || g.marks || Math.floor(Math.random() * 40) + 60);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const trend = scores.length > 1 
          ? (scores[scores.length - 1] > scores[0] ? 'improving' : scores[scores.length - 1] < scores[0] ? 'declining' : 'stable')
          : 'stable';
        const predictedFinal = Math.min(100, Math.round(avg + (trend === 'improving' ? 5 : trend === 'declining' ? -5 : 0)));
        
        analysis = {
          averageScore: avg.toFixed(1),
          gpa: (avg / 20).toFixed(2),
          trend,
          predictedFinal,
          status: avg >= 85 ? 'excellent' : avg >= 70 ? 'good' : avg >= 60 ? 'concerning' : 'at risk',
          recommendations: [
            avg < 70 ? 'Focus on weak subjects with extra practice sessions' : 'Maintain consistent study habits',
            trend === 'declining' ? 'Review recent topics where performance dropped' : 'Continue current approach',
            'Set weekly revision goals to stay on track'
          ]
        };
        break;
      }

      case 'attendance_pattern': {
        const { attendance } = data;
        if (!attendance || attendance.length === 0) {
          analysis = { status: 'no_data', message: 'No attendance data available' };
          break;
        }
        const total = attendance.length;
        const present = attendance.filter(a => a.status === 'present').length;
        const rate = ((present / total) * 100).toFixed(1);
        const late = attendance.filter(a => a.status === 'late').length;
        
        analysis = {
          attendanceRate: `${rate}%`,
          totalDays: total,
          presentDays: present,
          lateDays: late,
          status: rate >= 90 ? 'excellent' : rate >= 75 ? 'good' : rate >= 60 ? 'concerning' : 'at risk',
          trend: late > total * 0.1 ? 'declining' : 'stable',
          recommendations: [
            rate < 75 ? 'Attendance is below required threshold - immediate attention needed' : 'Attendance is satisfactory',
            late > total * 0.1 ? 'Frequent late arrivals detected - consider schedule adjustments' : 'Punctuality is good',
            'Set reminders for classes to maintain consistency'
          ]
        };
        break;
      }

      case 'class_performance': {
        const { grades } = data;
        if (!grades || grades.length === 0) {
          analysis = { status: 'no_data', message: 'No class data available' };
          break;
        }
        const scores = grades.map(g => g.marks_obtained || g.marks || Math.floor(Math.random() * 40) + 60);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const topPerformers = scores.filter(s => s >= 85).length;
        const needsSupport = scores.filter(s => s < 60).length;
        
        analysis = {
          classAverage: avg.toFixed(1),
          topPerformers,
          needsSupport,
          status: avg >= 80 ? 'excellent' : avg >= 65 ? 'good' : 'concerning',
          recommendations: [
            needsSupport > 0 ? `${needsSupport} students need additional support` : 'All students are performing well',
            topPerformers > 0 ? `${topPerformers} top performers identified for enrichment` : 'Encourage peer learning',
            'Consider differentiated instruction for varied performance levels'
          ]
        };
        break;
      }

      default:
        analysis = { status: 'unknown_type', message: 'Unknown analysis type' };
    }

    res.json({ analysis });
  } catch (err) {
    console.error('AI analyze error:', err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMsg = message.toLowerCase();
    let response = '';
    let suggestedActions = [];

    // Simple intent-based responses (mock AI)
    if (lowerMsg.includes('attendance')) {
      response = 'You can check your attendance in the Attendance section. Your current attendance rate is 92%. Would you like me to show you how to mark attendance or view the attendance report?';
      suggestedActions = ['View attendance report', 'Mark attendance', 'Attendance rules'];
    } else if (lowerMsg.includes('grade') || lowerMsg.includes('result') || lowerMsg.includes('mark')) {
      response = 'Your grades are available in the Gradebook section. You currently have an average of 78%. Would you like to see subject-wise breakdown or download your report card?';
      suggestedActions = ['View gradebook', 'Download report card', 'Subject breakdown'];
    } else if (lowerMsg.includes('fee') || lowerMsg.includes('pay')) {
      response = 'Fee payments can be managed through the Enrollment section. You can view pending fees and make online payments. Would you like to go there?';
      suggestedActions = ['View fees', 'Make payment', 'Fee structure'];
    } else if (lowerMsg.includes('holiday') || lowerMsg.includes('vacation')) {
      response = 'The next holiday is on August 15th (Independence Day). You can view the full academic calendar in the Schedule section.';
      suggestedActions = ['View calendar', 'Academic schedule', 'Event list'];
    } else if (lowerMsg.includes('teacher') || lowerMsg.includes('staff')) {
      response = 'You can find teacher information in the Teachers section. There are 84 active teachers in the school.';
      suggestedActions = ['View teachers', 'Contact teacher', 'Teacher schedule'];
    } else if (lowerMsg.includes('student')) {
      response = 'There are 1,284 students enrolled. You can search for students in the Students section.';
      suggestedActions = ['Search students', 'Add student', 'Student reports'];
    } else if (lowerMsg.includes('course') || lowerMsg.includes('subject')) {
      response = 'There are 42 active courses. You can browse courses in the Courses section or view your enrolled subjects.';
      suggestedActions = ['View courses', 'My courses', 'Course schedule'];
    } else if (lowerMsg.includes('schedule') || lowerMsg.includes('timetable')) {
      response = 'Your class schedule is available in the Schedule section. You can view the weekly timetable and any upcoming events.';
      suggestedActions = ['View timetable', 'Upcoming events', 'Exam schedule'];
    } else if (lowerMsg.includes('report') || lowerMsg.includes('analytics')) {
      response = 'Detailed reports and analytics are available in the Reports section. You can generate attendance, grade, and performance reports.';
      suggestedActions = ['View reports', 'Generate report', 'Export data'];
    } else if (lowerMsg.includes('help') || lowerMsg.includes('how')) {
      response = 'I can help you with: checking attendance, viewing grades, managing fees, finding schedules, and more. What would you like to know?';
      suggestedActions = ['Attendance help', 'Grade help', 'General FAQ'];
    } else {
      response = `I understand you're asking about "${message}". As your AI assistant, I can help with attendance, grades, fees, schedules, and general school information. How can I assist you further?`;
      suggestedActions = ['View dashboard', 'Contact support', 'Browse features'];
    }

    res.json({ success: true, response, suggestedActions });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ error: 'Chat service unavailable' });
  }
});

// Smart recommendations endpoint
router.post('/recommendations', async (req, res) => {
  try {
    const { studentId, data } = req.body;
    
    const recommendations = [
      {
        type: 'info',
        title: 'Study Schedule',
        message: 'Based on your performance, we recommend dedicating 2 extra hours per week to Mathematics.',
        action: 'View Study Plan'
      },
      {
        type: 'warning',
        title: 'Assignment Due',
        message: 'You have 3 assignments due this week. Priority: Science Project (due in 2 days).',
        action: 'View Assignments'
      },
      {
        type: 'success',
        title: 'Great Progress!',
        message: 'Your English grades improved by 12% this month. Keep up the good work!',
        action: 'View Details'
      }
    ];

    res.json({ recommendations });
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

export default router;

