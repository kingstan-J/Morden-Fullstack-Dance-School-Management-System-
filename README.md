# 🎵 Drizzle Dance Academy — Dance School Management System

A full-stack MERN application for managing a professional dance academy with three roles: **Admin**, **Trainer**, and **Student**.

---

## 🚀 Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React.js, Vite, Tailwind CSS, Framer Motion     |
| Backend   | Node.js, Express.js                             |
| Database  | MongoDB, Mongoose                               |
| Auth      | JWT, bcryptjs                                   |
| PDF       | PDFKit                                          |
| Charts    | Recharts                                        |

---

## 📁 Project Structure

```
Dance-School-Management-System/
├── dance-school-backend/
│   ├── src/
│   │   ├── config/       → MongoDB connection
│   │   ├── controllers/  → Route handlers
│   │   ├── middleware/   → Auth, error, upload
│   │   ├── models/       → Mongoose schemas
│   │   ├── routes/       → Express routes
│   │   └── utils/        → JWT, email, PDF helpers
│   ├── uploads/          → Uploaded files & certificates
│   ├── server.js
│   ├── seeder.js
│   └── .env
│
└── dance-school-frontend/
    └── src/
        ├── components/   → Reusable UI components
        ├── pages/
        │   ├── public/   → Home, About, FAQ, Contact...
        │   ├── auth/     → Login, Register, Forgot Password
        │   ├── student/  → Student dashboard & features
        │   ├── trainer/  → Trainer dashboard & features
        │   └── admin/    → Admin panel & management
        ├── store/        → Zustand state management
        └── utils/        → Axios API instance
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)

---

### 1. Backend Setup

```bash
cd dance-school-backend

# Install dependencies
npm install

# Configure environment
# Edit .env — set MONGO_URI, JWT_SECRET, EMAIL credentials

# Seed sample data
npm run seed

# Start development server
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd dance-school-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Demo Login Credentials

| Role    | Email                          | Password    |
|---------|--------------------------------|-------------|
| Admin   | admin@drizzledance.com         | Admin@1234  |
| Trainer | priya@drizzledance.com         | Dance@1234  |
| Student | student1@drizzledance.com      | Dance@1234  |

---

## ✨ Features

### Student
- Enroll in one dance course
- View attendance records & percentage
- Pay fees & download receipts (PDF)
- Download completion certificates (PDF)
- Update profile

### Trainer
- View assigned course & enrolled students
- Mark daily attendance
- View student fee payment status
- Issue completion certificates
- Upload learning materials
- View monthly salary & download salary slips (PDF)

### Admin
- Full CRUD for Students, Trainers, Courses
- Assign trainers to courses
- Manage enrollments, attendance, payments, salaries, certificates
- Dashboard with analytics charts (Recharts)
- Download PDFs for receipts, salary slips, certificates

---

## 🎨 Design

- Color palette: **Purple, Pink, White, Black**
- Dark theme with glassmorphism cards
- Fully responsive (mobile-first)
- Smooth animations via Framer Motion
- Inter font from Google Fonts
