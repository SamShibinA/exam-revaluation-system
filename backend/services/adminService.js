import apiClient from './apiClient';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const adminService = {
  async getDashboardStats() {
    await delay(400);
    return {
      totalStudents: 1250,
      totalRequests: 45,
      pendingRequests: 12,
      approvedRequests: 25,
      rejectedRequests: 5,
      inReviewRequests: 3,
      completedToday: 4,
      avgProcessingTime: '2.5 days',
    };

    // const response = await apiClient.get('/admin/stats');
    // return response.data;
  },

  async getStudents(params) {
    const response = await apiClient.get('/admin/students', { params });
    return response.data;
  },

  async getStudentById(studentId) {
    const response = await apiClient.get(`/admin/students/${studentId}`);
    return response.data;
  },

  async updateStudent(studentId, data) {
    const response = await apiClient.put(
      `/admin/students/${studentId}`,
      data
    );
    return response.data;
  },

  async deleteStudent(studentId) {
    await apiClient.delete(`/admin/students/${studentId}`);
  },

  async exportRequests(params) {
    const response = await apiClient.get('/admin/requests/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
