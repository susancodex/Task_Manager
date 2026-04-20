# TaskFlow Frontend

A production-ready React frontend for the Django REST Framework Task Manager API.

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** — custom design tokens (Sora font, warm ink palette)
- **Axios** — centralized instance with JWT interceptors + auto-refresh
- **React Router DOM v6** — protected routes
- **Context API** — AuthContext + TaskContext
- **react-hot-toast** — toast notifications

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**

> Make sure your Django backend is running at `http://127.0.0.1:8000`

## Features

- ✅ JWT login / register / logout
- ✅ Auto token refresh on 401
- ✅ Protected routes (redirect to /login if unauthenticated)
- ✅ Dashboard with task stats
- ✅ Full task CRUD (create, edit, delete, toggle complete)
- ✅ Filter by status & priority
- ✅ Search with debounce
- ✅ Sort by created_at / due_date
- ✅ Pagination (next/previous)
- ✅ Overdue task detection
- ✅ Responsive layout (mobile sidebar overlay)
- ✅ Toast notifications for all actions
- ✅ Empty states & loading spinners
- ✅ Confirm dialog for deletion

## Project Structure

```
src/
├── api/           # axiosInstance.js, auth.js, tasks.js
├── components/
│   ├── common/    # Spinner, Badge, ConfirmDialog
│   ├── layout/    # Sidebar, Navbar
│   └── task/      # TaskCard, TaskModal
├── context/       # AuthContext, TaskContext
├── hooks/         # useDebounce, useTaskFilters
├── layouts/       # MainLayout
├── pages/         # Login, Register, Dashboard, Tasks, Profile
├── routes/        # ProtectedRoute
├── styles/        # globals.css
├── utils/         # helpers.js
├── App.jsx
└── main.jsx
```

## Backend API

Base URL: `http://127.0.0.1:8000/api/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/token/` | Login (get JWT) |
| POST | `/token/refresh/` | Refresh access token |
| POST | `/register/` | Register new user |
| GET | `/` | List tasks |
| POST | `/` | Create task |
| PUT | `/{id}/` | Update task |
| DELETE | `/{id}/` | Delete task |
