import apiClient from './apiClient';

// Mock data for demo purposes
const mockUsers = {
  'student@university.edu': {
    user: {
      id: '1',
      email: 'student@university.edu',
      name: 'John Doe',
      role: 'student',
      studentId: 'STU2024001',
      department: 'Computer Science',
    },
    password: 'student123',
  },
  'admin@university.edu': {
    user: {
      id: '2',
      email: 'admin@university.edu',
      name: 'Dr. Sarah Johnson',
      role: 'admin',
      department: 'Exam Department',
    },
    password: 'admin123',
  },
};

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(credentials) {
    // For demo, use mock authentication
    await delay(800);

    const mockUser = mockUsers[credentials.email];
    if (mockUser && mockUser.password === credentials.password) {
      return {
        user: mockUser.user,
        token: `mock_jwt_token_${Date.now()}`,
      };
    }

    throw new Error('Invalid email or password');

    // Real API call would be:
    // const response = await apiClient.post('/auth/login', credentials);
    // return response.data;
  },

  async register(data) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token, password) {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },
};
