# File Management Web Application

This is a web application for secure user login and multimedia file management. The project is divided into two parts:

- **Backend**: Powered by Node.js and Express, handles authentication, file uploads, and API routes.
- **Frontend**: Built with React, providing a user interface for login and file management.

## Dependencies

### Backend (Node.js)
- `express`: Web framework for Node.js.
- `cors`: Middleware for enabling Cross-Origin Requests.
- `jsonwebtoken`: Library for JWT-based authentication.
- `bcryptjs`: Library for hashing passwords.
- `multer`: Middleware for handling file uploads.
- `dotenv`: Loads environment variables from `.env` files.

### Frontend (React)
- `axios`: Promise-based HTTP client for making API requests.
- `react-router-dom`: DOM bindings for React Router, used for routing between pages.

## Installation Instructions

### 1. Clone the repository
Clone the repository to your local machine:
```bash
git clone git@github.com:gtuazon18/file-mgt.git
```

### Navigate to the backend folder and install the dependencies:

```bash
Copy code
cd backend
npm install
```

### Set up the Frontend
Navigate to the frontend folder and install the dependencies:

```bash
Copy code
cd ../frontend
npm install
```

## User Access

```bash
Admin
username: admin@example.com
password: password123

User
username: user@example.com
password: user123
```