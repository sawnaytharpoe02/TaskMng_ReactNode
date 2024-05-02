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

# .env.sample for backend
```
PORT = your_custom_port
MONGO_URL = mongodb+srv://username:password@cluster0.typegqq.mongodb.net/TaskManagementSym?retryWrites=true&w=majority
CLOUD_NAME = your_cloud_name
CLOUD_API_KEY = your_cloud_api_key
CLOUD_API_SECRET = your_cloud_api_secret
MAIL_SERVICE = smtp.gmail.com
MAIL_USER = your_email@gmail.com
MAIL_PASS = your_password
ABSTRACT_PRIVATE_KEY = your_abstract_private_key
JWT_SECRET_KEY = your_jwt_secret_key
CLIENT_DOMAIN = http://localhost:5173
```
# .env.sample for frontend
```
VITE_ENDPOINT = "http://localhost:5173/"
VITE_API_ENDPOINT = "http://localhost:port/api/v1/"
VITE_AUTH_API_ENDPOINT = "http://localhost:port/api/v1/auth/"
NODE_ENV = 'development'
```

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

5. ## User Interface Screenshots

| Feature | Description | Image |
|---|---|---|
| Dashboard | Provides an overview of projects, tasks, and reports. | ![Dashboard](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/6eccb5aa-2b2d-44d1-a940-c54fbcc62af9) |
| Employee List | Lists all employees within the system. | ![Employee_List](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/9913a922-2577-4034-89ae-5b682b640668) |
| Create Employee | Form to add a new employee. | ![Create Employee](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/8c7bd952-e15e-4ad3-a614-03a1c9ec7e44) |
| Project List | Displays all projects with search and filter options. | ![Project List](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/d13941f4-a392-4197-a636-77169728a796) |
| Create Project | Form to create a new project. | ![Create Project](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/89a00dc5-00fc-4322-8127-c275334e3826) |
| Create Task | Form to assign tasks to employees. | ![Create Task](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/bb2fb1ac-f339-4e07-b926-444afe9912bc) |
| Task List | Manages and tracks tasks with filtering by status. | ![Task List](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/b03fcdf7-a633-4b7a-a323-ed92ca613bd7) |
| Create Report | Form to generate reports based on project data. | ![Create Report](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/64e17e2c-3b10-4299-911f-11bfb97492ed) |
| Report Preview | Provides a visual representation of the generated report. | ![Report Preview](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/007ca7f3-956d-42f5-8756-b18632fb77b7) |
| Report List | Lists all reports with search functionality. | ![Report List](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/4d8d3062-42d1-4c33-8525-cb83b1e16442) |
| Employee Profile | View and edit employee information. | ![Employee Profile](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/1836e416-a074-4122-b540-179b034ac643) |
| Change Password | Form to update user password. | ![Change Password](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/7773eaf8-0604-4011-8ea2-e11f85ce41ad) |
| Forgot Password Form | Form to request a password reset link. | ![Forgot Password](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/a428bcbd-c70b-4403-99a9-50b5fdfcfadf) |
| Login Page | User login interface. | ![Login Page](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/5dd785a9-1b9d-4828-834c-349e862d249a) |
| Password Reset Email | Email notification sent for password reset. | ![Password Reset Email](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/2db2a616-65cd-4723-8c8c-5154c994c2ed) |
| Password Reset Form | Form to set a new password after requesting a reset. | ![Password Reset Form](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/a2fe65c0-2910-4d07-b3bb-8ffa8c6e860a) |
| Report Notification | Notification displayed for new reports. | ![Report Notification](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/1d9f8dc9-c80d-422b-98a4-129e40b4b9dc) |
| Task Notification | Notification displayed for assigned tasks. | ![Task Notification](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/3d1307d5-9379-46ad-a83c-febcd2e68db9) |
| Verify Email | User verifiy email link after creating a new employee. | ![Verify Email](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/5c979e29-32db-4e02-8bfd-7112796493e6) |
| Verification Successful | Confirmation message page after successful email verification. | ![Verification Successful](https://github.com/sawnaytharpoe02/TaskMng_ReactNode/assets/100279951/4c15b0d9-ee3e-4bd0-916c-d0338650f11f) |




