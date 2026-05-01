# 📝 Task Manager Application

A modern, collaborative Task Management and Project Tracking web application built with the MERN/Node.js stack. Designed with a sleek dark-mode interface, this application helps teams organize their work efficiently through customizable projects and Kanban-style task boards.

## 📖 Long Description

The **Task Manager Application** is a comprehensive productivity tool designed to bridge the gap between individual task tracking and team collaboration. Whether you are managing personal side projects or collaborating with a team of developers, this platform provides a centralized workspace to keep everything organized. 

Users can create dedicated projects, invite team members (assigning them either Member or Admin roles), and break down large project goals into actionable tasks. The core of the application revolves around its intuitive **Kanban-style task board**, which allows users to visually track the lifecycle of a task from `TODO` to `IN PROGRESS` and finally to `DONE`.

With built-in secure user authentication, an informative personal dashboard showing task statistics (such as overdue items and completion rates), and real-time interface updates, this application ensures that everyone stays on the same page and no deadline is missed.

## ✨ Key Features

* **User Authentication:** Secure Signup, Login, and session management using JWT (JSON Web Tokens).
* **Personal Dashboard:** A high-level overview of your assigned tasks, separated by statuses (Todo, In Progress, Done, Overdue) and total task counts.
* **Project Management:** Create multiple projects to separate different streams of work.
* **Team Collaboration:** Invite other users to your projects via email. Assign role-based access (Admins can delete tasks and invite members; Members can view and update task statuses).
* **Kanban Task Board:** Visual workflow management. Easily change task statuses and assign tasks to specific project members.
* **Modern UI/UX:** A premium, fully responsive, dark-themed user interface utilizing dynamic layouts, glassmorphism elements, and smooth CSS micro-animations.

## 🛠️ Tech Stack

**Frontend:**
* React (via Vite)
* React Router DOM (for client-side routing)
* Vanilla CSS (Custom modern dark-theme design system)

**Backend:**
* Node.js & Express.js
* RESTful API architecture
* JWT for Authentication

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

**1. Clone the repository**
```bash
git clone <your-repository-url>
cd TaskManagerProject/task-manager
```

**2. Setup the Backend server**
```bash
cd backend
npm install
# Create a .env file and add your environment variables (Database URI, JWT Secret, etc.)
npm start
# The backend will typically run on http://localhost:5000 (or your configured port)
```

**3. Setup the Frontend client**
```bash
cd ../frontend
npm install
npm run dev
# The frontend will typically run on http://localhost:5173
```

## 📂 Basic Project Structure

```text
task-manager/
├── backend/               # Node.js Express Server
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API route definitions
│   │   └── index.js       # Server entry point
│   └── package.json
└── frontend/              # React (Vite) Application
    ├── src/
    │   ├── pages/         # React components (Dashboard, Projects, Login, etc.)
    │   ├── App.css        # Global layout styling
    │   ├── index.css      # Core theme colors and CSS variables
    │   ├── api.js         # Axios API configuration
    │   └── main.jsx       # React entry point
    └── package.json
```
