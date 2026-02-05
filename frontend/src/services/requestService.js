import apiClient from './apiClient';

// Mock data
const mockRequests = [
  {
    id: 'REQ001',
    studentId: '1',
    studentName: 'John Doe',
    studentEmail: 'student@university.edu',
    subjectId: '1',
    subject: { id: '1', code: 'CS301', name: 'Data Structures', semester: 3, credits: 4 },
    requestType: 'revaluation',
    reason:
      'I believe my answer for Question 3 on Trees was marked incorrectly. I provided a valid implementation of AVL tree rotations.',
    currentMarks: 67,
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'REQ002',
    studentId: '1',
    studentName: 'John Doe',
    studentEmail: 'student@university.edu',
    subjectId: '2',
    subject: { id: '2', code: 'CS302', name: 'Algorithm Design', semester: 3, credits: 4 },
    requestType: 'review',
    reason: 'Request to review the marks for the dynamic programming section.',
    currentMarks: 72,
    status: 'in_review',
    responseSheet: '/documents/response_sheet_1.pdf',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'REQ003',
    studentId: '1',
    studentName: 'John Doe',
    studentEmail: 'student@university.edu',
    subjectId: '3',
    subject: { id: '3', code: 'CS303', name: 'Database Systems', semester: 3, credits: 3 },
    requestType: 'revaluation',
    reason: 'SQL query optimization answer needs re-evaluation.',
    currentMarks: 58,
    status: 'approved',
    updatedMarks: 65,
    adminRemarks:
      'After re-evaluation, 7 marks have been added for the query optimization answer.',
    responseSheet: '/documents/response_sheet_2.pdf',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Additional mock requests for admin view
const allMockRequests = [
  ...mockRequests,
  {
    id: 'REQ004',
    studentId: '2',
    studentName: 'Alice Smith',
    studentEmail: 'alice@university.edu',
    subjectId: '4',
    subject: { id: '4', code: 'CS304', name: 'Operating Systems', semester: 3, credits: 4 },
    requestType: 'revaluation',
    reason: 'Process scheduling answer was not fully graded.',
    currentMarks: 55,
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'REQ005',
    studentId: '3',
    studentName: 'Bob Wilson',
    studentEmail: 'bob@university.edu',
    subjectId: '5',
    subject: { id: '5', code: 'CS305', name: 'Computer Networks', semester: 3, credits: 3 },
    requestType: 'review',
    reason: 'Request to view my answer sheet for the TCP/IP section.',
    currentMarks: 48,
    status: 'pending',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'REQ006',
    studentId: '4',
    studentName: 'Carol Johnson',
    studentEmail: 'carol@university.edu',
    subjectId: '1',
    subject: { id: '1', code: 'CS301', name: 'Data Structures', semester: 3, credits: 4 },
    requestType: 'revaluation',
    reason:
      'Hash table implementation was marked as incomplete but it was fully implemented.',
    currentMarks: 61,
    status: 'rejected',
    adminRemarks:
      'After thorough review, the original marks stand correct. The implementation was incomplete.',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const requestService = {
  async getMyRequests() {
    await delay(500);
    return mockRequests;

    // Real API:
    // const response = await apiClient.get('/requests/my');
    // return response.data;
  },

  async getRequestById(requestId) {
    await delay(300);
    const request = allMockRequests.find((r) => r.id === requestId);
    if (!request) throw new Error('Request not found');
    return request;

    // const response = await apiClient.get(`/requests/${requestId}`);
    // return response.data;
  },

  async createRequest(data) {
    await delay(800);

    const newRequest = {
      id: `REQ${Date.now()}`,
      studentId: '1',
      studentName: 'John Doe',
      studentEmail: 'student@university.edu',
      subjectId: data.subjectId,
      subject: {
        id: data.subjectId,
        code: 'CS301',
        name: 'Data Structures',
        semester: 3,
        credits: 4,
      },
      requestType: data.requestType,
      reason: data.reason,
      currentMarks: 67,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newRequest;

    // const response = await apiClient.post('/requests', data);
    // return response.data;
  },

  async getAllRequests(params = {}) {
    await delay(500);

    let filtered = [...allMockRequests];

    if (params.status) {
      filtered = filtered.filter((r) => r.status === params.status);
    }

    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.studentName.toLowerCase().includes(search) ||
          r.subject.name.toLowerCase().includes(search) ||
          r.id.toLowerCase().includes(search)
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };

    // const response = await apiClient.get('/requests', { params });
    // return response.data;
  },

  async updateRequestStatus(requestId, data) {
    await delay(600);
    const request = allMockRequests.find((r) => r.id === requestId);
    if (!request) throw new Error('Request not found');

    return {
      ...request,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // const response = await apiClient.patch(
    //   `/requests/${requestId}/status`,
    //   data
    // );
    // return response.data;
  },

  async uploadResponseSheet(requestId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      `/requests/${requestId}/response-sheet`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data;
  },
};
