import apiClient from './apiClient';

// Mock data
const mockSubjects = [
  { id: '1', code: 'CS301', name: 'Data Structures', semester: 3, credits: 4 },
  { id: '2', code: 'CS302', name: 'Algorithm Design', semester: 3, credits: 4 },
  { id: '3', code: 'CS303', name: 'Database Systems', semester: 3, credits: 3 },
  { id: '4', code: 'CS304', name: 'Operating Systems', semester: 3, credits: 4 },
  { id: '5', code: 'CS305', name: 'Computer Networks', semester: 3, credits: 3 },
  { id: '6', code: 'MA301', name: 'Discrete Mathematics', semester: 3, credits: 3 },
];

const mockMarks = mockSubjects
  .map((subject, index) => ({
    id: `mark_${index + 1}`,
    subjectId: subject.id,
    subject,
    studentId: '1',
    internalMarks: Math.floor(Math.random() * 15) + 20,
    externalMarks: Math.floor(Math.random() * 30) + 40,
    totalMarks: 0,
    grade: '',
    semester: 3,
    academicYear: '2024-25',
  }))
  .map((mark) => {
    const total = mark.internalMarks + mark.externalMarks;
    let grade = 'F';
    if (total >= 90) grade = 'A+';
    else if (total >= 80) grade = 'A';
    else if (total >= 70) grade = 'B+';
    else if (total >= 60) grade = 'B';
    else if (total >= 50) grade = 'C';
    else if (total >= 40) grade = 'D';
    return { ...mark, totalMarks: total, grade };
  });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const marksService = {
  async getMarks(studentId, semester) {
    // Mock implementation
    await delay(500);
    return mockMarks;

    // Real API:
    // const params = new URLSearchParams();
    // if (studentId) params.append('studentId', studentId);
    // if (semester) params.append('semester', semester.toString());
    // const response = await apiClient.get(`/marks?${params}`);
    // return response.data;
  },

  async getMarkById(markId) {
    await delay(300);
    const mark = mockMarks.find((m) => m.id === markId);
    if (!mark) throw new Error('Mark not found');
    return mark;

    // const response = await apiClient.get(`/marks/${markId}`);
    // return response.data;
  },

  async getStudentStats() {
    await delay(400);
    return {
      totalSubjects: 6,
      currentSemester: 3,
      cgpa: 8.5,
      totalRequests: 3,
      pendingRequests: 1,
      approvedRequests: 1,
      rejectedRequests: 0,
      inReviewRequests: 1,
    };

    // const response = await apiClient.get('/student/stats');
    // return response.data;
  },

  async getSubjects(semester) {
    await delay(300);
    return semester
      ? mockSubjects.filter((s) => s.semester === semester)
      : mockSubjects;

    // const response = await apiClient.get(
    //   `/subjects${semester ? `?semester=${semester}` : ''}`
    // );
    // return response.data;
  },

  async updateMarks(markId, data) {
    const response = await apiClient.put(`/marks/${markId}`, data);
    return response.data;
  },
};
