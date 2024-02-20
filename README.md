# Task Management System Fullstack App

This project is a full-stack task management system designed to streamline project and task organization. Users can authenticate through an admin-managed process, create projects and tasks, generate reports, and benefit from various features including search functionality, filtering, and export capabilities.

## Authentication Process

- Only admin can create users.
- Upon creation, users receive a password and email confirmation.
- Authentication is necessary for accessing the system, and only confirmed users can proceed.

## Project Management

- CRUD operations for projects.
- Search functionality for projects by name and language.

## Task Management

- CRUD operations for tasks.
- Search functionality and filtering by status.
- Excel export feature.
- Employee assignment with notifications using socket.io.

## Report Management

- CREATE multi reports operation.
- Search functionality for reports by name.
- Excel export feature.
- Filtering with date picker.

## Other Features

- User notification system.
- Permission management.
- Page loading and network error handling.

## Tech Stack

### Backend

- Express.js
- TypeScript
- MongoDB
- Nodemailer for email functionality
- Socket.io for real-time notifications
- Cloudinary for storing user profiles

### Frontend

- ReactJS
- Ant Design UI for design components
- SCSS for customization
- Context API for state management
- React Lazy Load Image Component for lazy loading profile images
- Lottie React for email confirmation animations
- Other relevant packages for additional functionality

## Getting Started

1. Clone this repository.
2. Install dependencies for both backend and frontend.
3. Set up your MongoDB database.
4. Configure email settings with Nodemailer.
5. Run the backend server.
6. Run the frontend application.
7. Access the application in your browser.

### Backend

1. Navigate to the backend directory.
   ```
   cd backend
   ```

2. Install dependencies.
   ```
   npm install
   ```

3. Start the backend server.
   ```
   npm run serve
   ```
   or
   ```
   yarn serve
   ```

### Frontend

1. Navigate to the frontend directory.
   ```
   cd frontend
   ```

2. Install dependencies.
   ```
   npm install
   ```

3. Start the frontend development server.
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Access the application in your browser by navigating to the specified URL provided by the frontend development server.

With these steps, you should be able to start both the backend and frontend servers and access the application locally for development purposes.
