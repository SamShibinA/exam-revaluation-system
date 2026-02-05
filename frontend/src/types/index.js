/** @typedef {'student' | 'admin'} UserRole */
/** @typedef {'pending' | 'in_review' | 'approved' | 'rejected' | 'completed'} RequestStatus */
/** @typedef {'review' | 'revaluation'} RequestType */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {UserRole} role
 * @property {string=} studentId
 * @property {string=} department
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {string|null} token
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user
 * @property {string} token
 */

/**
 * @typedef {Object} Subject
 * @property {string} id
 * @property {string} code
 * @property {string} name
 * @property {number} semester
 * @property {number} credits
 */

/**
 * @typedef {Object} Mark
 * @property {string} id
 * @property {string} subjectId
 * @property {Subject} subject
 * @property {string} studentId
 * @property {number} internalMarks
 * @property {number} externalMarks
 * @property {number} totalMarks
 * @property {string} grade
 * @property {number} semester
 * @property {string} academicYear
 */

/**
 * @typedef {Object} RevaluationRequest
 * @property {string} id
 * @property {string} studentId
 * @property {string} studentName
 * @property {string} studentEmail
 * @property {string} subjectId
 * @property {Subject} subject
 * @property {RequestType} requestType
 * @property {string} reason
 * @property {number} currentMarks
 * @property {RequestStatus} status
 * @property {string=} responseSheet
 * @property {number=} updatedMarks
 * @property {string=} adminRemarks
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalRequests
 * @property {number} pendingRequests
 * @property {number} approvedRequests
 * @property {number} rejectedRequests
 * @property {number} inReviewRequests
 */

/**
 * @typedef {DashboardStats & {
 *   totalSubjects: number,
 *   currentSemester: number,
 *   cgpa: number
 * }} StudentDashboardStats
 */

/**
 * @typedef {DashboardStats & {
 *   totalStudents: number,
 *   completedToday: number,
 *   avgProcessingTime: string
 * }} AdminDashboardStats
 */

/**
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 * @property {number} totalPages
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {string=} code
 * @property {Record<string, string>=} details
 */

export {};
