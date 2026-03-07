# Exam Revaluation System

A comprehensive web application designed to streamline the exam revaluation and review process for students and administrators. The system features a modern, responsive UI built with React and Material-UI, and a robust backend powered by Node.js and MongoDB.

## Features

### For Students
- **View Marks**: Access exam results and marks for all subjects.
- **Apply for Review**: Request to view answer sheets with a transparent tracking system.
- **Apply for Revaluation**: Submit requests for grade re-evaluation by experts.
- **Real-time Status Tracking**: Monitor the progress of requests from "Submitted" to "Completed".
- **Response Sheet Access**: View uploaded response sheets directly within the application.

### For Administrators
- **Dashboard Overview**: Get a high-level summary of all pending and processed requests.
- **Request Management**: Review, approve, or reject student revaluation requests.
- **Document Management**: Upload response sheets and exam documentation.
- **Student Management**: View and manage student records and academic information.
- **System Settings**: Configure profile and notification preferences.

## Tech Stack

### Frontend
- **React 19**: Core framework for building the user interface.
- **Material-UI (MUI) 7**: Premium design system and component library.
- **React Router 7**: Handles client-side routing.
- **TanStack React Query**: Efficient data fetching and state management.
- **React Hook Form & Zod**: Robust form handling and schema validation.
- **Axios**: HTTP client for API communication.
- **Date-fns**: Date utility library.
- **Notistack**: Snackbar notifications for user feedback.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express 5**: Fast and minimalist web framework.
- **MongoDB & Mongoose**: NoSQL database and object modeling.
- **JWT (JSON Web Token)**: Secure authentication and authorization.
- **BcryptJS**: Password hashing for security.
- **Multer**: Middleware for handling file uploads.
- **Cors**: Cross-origin resource sharing.

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/SamShibinA/exam-revaluation-system.git
cd exam-revaluation-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory and add:
```env
VITE_BACKEND_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
Start the frontend development server:
```bash
npm run dev
```

## Responsiveness
The project is fully responsive and optimized for:
- 📱 Mobile Devices
- 📑 Tablets
- 💻 Desktops

Enhanced with custom animations and a premium glassmorphism aesthetic.
