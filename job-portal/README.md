# TalentSphere — Modern Full-Stack Job Portal 🚀

A modern, full-featured Job Portal web application built with a **React 19 + Tailwind CSS** frontend and an **Express.js** REST API backend, pre-populated with realistic seed data and an Applicant Tracking System (ATS).

---

## 🌟 Features Overview

### 1. 🔍 Job Seeker (Candidate) Experience
- **Interactive Search & Discovery**:
  - Full-text search across job titles, companies, descriptions, and skill requirements.
  - Multi-criteria filtering: **Workplace Type** (Remote, Hybrid, On-site), **Job Type** (Full-time, Part-time, Contract, Internship), **Experience Level** (Entry, Mid, Senior, Lead), and **Salary Range Slider** ($50k - $250k).
  - Category filters: Software Engineering, Design, Product Management, Data Science, DevOps & Cloud, Marketing.
  - Sorting: Featured/Newest, Highest Salary, Lowest Salary, Oldest.
- **Job Details Drawer / Modal**:
  - Full role overview, key responsibilities, qualifications & requirements, and company perks.
  - Related jobs in the same vertical.
- **1-Click Application Workflow**:
  - Pre-filled profile details.
  - Resume upload support (PDF, DOCX, TXT) and portfolio link attachment.
  - Cover note to hiring manager.
  - Duplicate application prevention.
- **Candidate Dashboard (`My Applications`)**:
  - Real-time application tracker: `Applied` ➔ `Reviewing` ➔ `Interview` ➔ `Offer` ➔ `Rejected`.
  - Recruiter feedback notes.
  - Option to withdraw applications.
- **Saved Jobs (Bookmarks)**:
  - Save interesting roles and apply whenever ready.

### 2. 🏢 Employer & Recruiter Experience
- **Employer Hub & ATS Pipeline**:
  - **Requisitions Manager**: View all posted jobs, toggle status (`Active` / `Closed`), inspect candidate counts, or delete listings.
  - **Candidate Pipeline (ATS)**: Filter candidates by job, inspect candidate statements and portfolio links, download/open uploaded resumes, and change candidate stages (`Applied` ➔ `Reviewing` ➔ `Interview` ➔ `Offer` ➔ `Rejected`).
  - **Private Recruiter Notes**: Write and update evaluation feedback per candidate.
- **Post a New Job**:
  - Comprehensive posting form: Title, Company Name, Category, Workplace Type, Employment Type, Location, Salary Min/Max, Job Description, Bulleted Requirements, Responsibilities, and Benefits, plus Featured listing toggle.

### 3. 👥 1-Click Demo Profiles & Role Switcher
Effortlessly switch between personas right from the navigation bar:
- **Alex Morgan** (Senior Full Stack Engineer — Candidate)
- **Priya Sharma** (Lead Product Designer — Candidate)
- **Sarah Jenkins** (Head of Tech Recruiting @ Stripe — Employer)
- **David Chen** (VP People & Culture @ Linear — Employer)
- *Or create a custom profile in seconds!*

---

## 📂 Project Architecture

```
job-portal/
├── package.json               # Root orchestrator (concurrently runs client & server)
├── README.md                  # Project documentation
├── client/                    # Frontend (React 19, Tailwind CSS v4, Lucide Icons, Vite)
│   ├── index.html
│   ├── vite.config.js         # Configured with API proxy to port 5000
│   ├── src/
│   │   ├── main.jsx           # React app mount
│   │   ├── App.jsx            # Main app controller & routing
│   │   ├── index.css          # Tailwind CSS styles
│   │   ├── services/
│   │   │   └── api.js         # Centralized API service layer
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── Hero.jsx
│   │       ├── CategoryPills.jsx
│   │       ├── JobFilters.jsx
│   │       ├── JobCard.jsx
│   │       ├── JobDetailModal.jsx
│   │       ├── ApplyModal.jsx
│   │       ├── CandidateDashboard.jsx
│   │       ├── EmployerDashboard.jsx
│   │       ├── BookmarksView.jsx
│   │       ├── PostJobModal.jsx
│   │       ├── UserSwitcherModal.jsx
│   │       └── Toast.jsx
│   └── dist/                  # Production build of frontend
└── server/                    # Backend (Node.js, Express.js, Multer)
    ├── package.json
    ├── server.js              # Express app entry point
    ├── db.js                  # Persistent JSON database with seed data
    ├── data/
    │   └── db.json            # Persistent database file
    ├── uploads/               # Stored candidate resume uploads
    └── routes/
        ├── jobs.js            # Job search, filtering, and CRUD
        ├── applications.js    # Candidate application workflow & ATS pipeline
        ├── auth.js            # User accounts, switcher & demo profiles
        ├── bookmarks.js       # Saved jobs
        └── stats.js           # Analytics metrics & categories
```

---

## 🚀 How to Run

### Development Mode (Both Frontend + Backend with Live Reload):
From the root `job-portal` folder:
```bash
npm run dev
```
- **Frontend URL**: [http://localhost:3000](http://localhost:3000) (Vite HMR)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

### Production Mode (Unified Single Port):
```bash
npm start
```
- Serves both the compiled React frontend and the REST API simultaneously on:
  [http://localhost:5000](http://localhost:5000)

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | Search & filter jobs (supports `search`, `category`, `location`, `workplaceType`, `jobType`, `experienceLevel`, `salaryMin`, `sort`) |
| `GET` | `/api/jobs/:id` | Get job details and related jobs |
| `POST` | `/api/jobs` | Create new job requisition |
| `PUT` | `/api/jobs/:id` | Update job requisition / status |
| `DELETE` | `/api/jobs/:id` | Delete job requisition |
| `POST` | `/api/applications` | Submit application (supports file upload or resume link) |
| `GET` | `/api/applications/candidate/:id` | Candidate view of their applications |
| `GET` | `/api/applications/employer/:id` | Employer ATS pipeline across all their jobs |
| `PATCH` | `/api/applications/:id/status` | Update candidate hiring stage & recruiter notes |
| `DELETE` | `/api/applications/:id` | Withdraw application |
| `GET` | `/api/bookmarks/:userId` | List saved jobs |
| `POST` | `/api/bookmarks` | Save job |
| `DELETE` | `/api/bookmarks/:userId/:jobId`| Remove saved job |
| `GET` | `/api/stats` | Platform metrics (jobs, companies, applicants) |
| `GET` | `/api/categories` | Categories with open job counts |
| `GET` | `/api/auth/users` | List demo users for switching |
