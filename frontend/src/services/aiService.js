import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_MOCK_URL || 'http://localhost:3001';

// AI Analysis Types
export const AI_ANALYSIS_TYPES = {
  STUDENT_PERFORMANCE: 'student_performance',
  ATTENDANCE_PATTERN: 'attendance_pattern',
  CLASS_PERFORMANCE: 'class_performance'
};

// Analyze student performance
export const analyzeStudentPerformance = async (studentId, grades) => {
  try {
    const response = await axios.post(`${API_URL}/api/ai/analyze`, {
      type: AI_ANALYSIS_TYPES.STUDENT_PERFORMANCE,
      data: { grades }
    });
    return response.data.analysis;
  } catch (error) {
    console.error('Student performance analysis failed:', error);
    return null;
  }
};

// Analyze attendance patterns
export const analyzeAttendancePattern = async (studentId, attendance) => {
  try {
    const response = await axios.post(`${API_URL}/api/ai/analyze`, {
      type: AI_ANALYSIS_TYPES.ATTENDANCE_PATTERN,
      data: { attendance }
    });
    return response.data.analysis;
  } catch (error) {
    console.error('Attendance pattern analysis failed:', error);
    return null;
  }
};

// Analyze class performance
export const analyzeClassPerformance = async (classId, grades) => {
  try {
    const response = await axios.post(`${API_URL}/api/ai/analyze`, {
      type: AI_ANALYSIS_TYPES.CLASS_PERFORMANCE,
      data: { grades }
    });
    return response.data.analysis;
  } catch (error) {
    console.error('Class performance analysis failed:', error);
    return null;
  }
};

// AI Chatbot
export const sendChatMessage = async (message, context = {}) => {
  try {
    const response = await axios.post(`${API_URL}/api/ai/chat`, {
      message,
      context
    });
    return response.data;
  } catch (error) {
    console.error('AI Chat failed:', error);
    return { success: false, response: 'Sorry, I\'m having trouble connecting to the AI service.' };
  }
};

// Smart recommendations
export const getSmartRecommendations = async (studentId, data) => {
  const analysis = await analyzeStudentPerformance(studentId, data.grades);
  if (!analysis) return [];
  
  const recommendations = [];
  
  if (analysis.trend === 'declining') {
    recommendations.push({
      type: 'warning',
      title: 'Performance Alert',
      message: 'Your grades have been declining. Consider scheduling extra study sessions.',
      action: 'View Study Plan'
    });
  }
  
  if (analysis.predictedFinal < 60) {
    recommendations.push({
      type: 'danger',
      title: 'At Risk',
      message: 'You may fail in the final exams if current performance continues.',
      action: 'Contact Teacher'
    });
  }
  
  return recommendations;
};

// Generate study plan
export const generateStudyPlan = async (studentId, weakSubjects) => {
  const studyPlan = weakSubjects.map(subject => ({
    subject,
    priority: 'high',
    activities: [
      `Review ${subject} basics`,
      `Practice ${subject} problems daily`,
      `Schedule extra classes for ${subject}`,
      `Join study group for ${subject}`
    ],
    estimatedHours: 2
  }));
  
  return studyPlan;
};

// Predict exam results
export const predictExamResults = async (studentId, currentGrades, upcomingExams) => {
  const analysis = await analyzeStudentPerformance(studentId, currentGrades);
  
  if (!analysis) return null;
  
  return upcomingExams.map(exam => ({
    ...exam,
    predictedScore: Math.min(100, analysis.predictedFinal + (Math.random() * 10 - 5)),
    confidence: analysis.trend === 'improving' ? 'high' : 'medium'
  }));
};

// AI-powered search
export const smartSearch = async (query, type = 'all') => {
  // This would integrate with the AI to provide smart search results
  console.log('Smart search:', query, type);
  return [];
};

// Export all AI services
export default {
  analyzeStudentPerformance,
  analyzeAttendancePattern,
  analyzeClassPerformance,
  sendChatMessage,
  getSmartRecommendations,
  generateStudyPlan,
  predictExamResults,
  smartSearch
};