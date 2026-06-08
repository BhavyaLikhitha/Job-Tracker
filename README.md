# 🌟 ApplyTrack - Your Ultimate Job Tracker 🌟

## 🚀 Track Your Jobs Effortlessly & For Free! 💼✨

**ApplyTrack** is your all-in-one platform to organize and streamline your job applications, absolutely **free**! Whether you're chasing your first co-op, switching careers, or aiming for your dream role, ApplyTrack helps you stay on top of every opportunity — track each application, watch your stats update live, and keep your daily momentum going with a built-in consistency streak. 🔥

---

## 🔗 Live Demo
[👉 Try ApplyTrack Now](https://job-tracker-coop-search.vercel.app/)

## 📷 Screenshots

### 🎉 Welcome Page
A welcoming dashboard showing dynamic statistics and options for job tracking.
![Welcome Page](./screenshots/afterlog.png)

---

### 📋 Table Details
Comprehensive table displaying detailed job information like company name, job title, and more.
![Table Details](./screenshots//table.png)

---

### 🔑 Login Page
Simple and secure login interface for users to access their job tracking dashboard.
![Login Page](./screenshots/login.png)

---

### ✍️ Signup Page
User-friendly signup form to create a personalized job tracking account.
![Signup Page](./screenshots/signup.png)

---

## 🔥 Why Use ApplyTrack? 🔥
- ✅ **Effortless Job Tracking**: Manage all your job applications in one clean place.
- ✅ **Dynamic Stats**: Visualize your job search progress at a glance.
- ✅ **Consistency Streak**: Stay motivated with a weekday streak that rewards daily applying.
- ✅ **Lightning-Fast Search**: Find any company instantly as you type.
- ✅ **Smart Pagination**: Loads only what you need, so big lists stay snappy.
- ✅ **User-Friendly Interface**: Minimalist, intuitive design.
- ✅ **Fully Responsive**: Optimized for all devices.
- ✅ **Secure**: Individual login and signup with protected, per-user data.
- ✅ **Completely Free**: No hidden fees or subscriptions!
---

## 🛠️ Tech Stack 🛠️

### 🖥️ **Frontend**
- **React** ⚛️
- **React Router** 🧭
- **CSS** 🎨
- **HTML** 
- **Javascript** 

### 🌐 **Backend**
- **Express.js** 🚀
- **Node.js** 🌲
- **JWT Authentication** 🔐

### **Database**
- **MongoDB** 🍃 (with **Mongoose** ODM)

### ☁️ **Deployment**
- **Vercel** 🚀

---

## ✨ Features ✨

### 📌 **Hero Section**
- A visually appealing introduction with an inspiring message and a sleek **hero image** to kickstart your tracking journey.

### 📊 **Job Statistics** 
- Stay on top of your job search with **dynamic stats**, computed live across all your applications:
  - **Jobs Applied Today**: See how many applications you've sent today.
  - **Total Jobs Applied**: Keep a count of all your applications.
  - **Total Rejected**: See how many jobs you've been rejected for.
  - **Streak (Weekdays)**: Track your consecutive weekday streak — Saturdays and Sundays are skipped, so weekends never break your momentum. 💪
  - **Interviews Ongoing**: Track jobs where interviews are in progress.

### 📝 **Job Details Table**
- View detailed job information at a glance:
  - **Company Name**
  - **Date Applied** 📅
  - **Job Title**
  - **Status** — update an application's stage right from the table.
  - **Referral** — see whether a job came through a referral, along with the referrer's name. 🤝

### 🔍 **Real-Time Search**
- Instantly filter your applications by company name as you type, with debounced requests for a smooth, efficient experience.

### 📄 **Smart Pagination**
- Applications load **10 per page**, fetched from the server on demand — so the app stays fast even with hundreds of entries.

### ➕ **Add Job**
- Easily add new job opportunities with all the relevant details:
  - Company name, application date, job title, referral type (with referrer name), and current status.

### 🔐 **Login & Signup**
- Secure access for individual users to track their jobs privately, backed by JWT-based authentication.

### 🎨 **Responsive UI**
- A **clean and intuitive interface** designed to work seamlessly across devices (desktop, tablet, and mobile). 📱💻

---

## 🧪 Engineering & Quality 🧪

Beyond features, ApplyTrack is built with production-minded engineering practices:

- **Automated testing** — 25 tests (unit + API integration) using **Vitest**, **Supertest**, and an in-memory **MongoDB** (`mongodb-memory-server`).
- **CI pipeline** — **GitHub Actions** runs the full test suite (with coverage gate) and the client build on every push and pull request.
- **Continuous deployment** — **Vercel** auto-deploys the client and API on every merge to `main`.
- **Containerization** — multi-stage **Dockerfiles** for client and server plus a `docker-compose` stack (Mongo + API + client) for one-command local setup.
- **API documentation** — interactive **OpenAPI / Swagger UI** at `/api-docs`.
- **Security hardening** — **helmet** security headers, JWT auth, and a `/health` liveness probe.
- **Performance** — indexed MongoDB queries and a single aggregation pipeline powering the dashboard.

---

## 📊 Project Metrics 📊

| Metric | Value |
|---|---|
| Test pass rate | **100%** (25/25 passing) |
| Test coverage (server controllers) | **~83%** lines, **100%** functions, **80%** branches |
| Automated tests | **25** (15 unit + 10 integration) |
| Dashboard DB round-trips | **6 → 1** (single `$facet` aggregation, **~83% fewer** queries) |
| Dashboard API response time | **~8 ms** avg, **~11 ms** p95 |
| Dashboard payload reduction | **up to ~95%** for large accounts (10 records/page vs. all *N*) |
| Client build time | **~1.5 s** (Vite) |
| Client bundle size | **221 KB** (~**72 KB** gzipped) |
| Lighthouse performance score | **94 / 100** |
| First Contentful Paint | **1.3 s** |
| CI build + test run | **< 1 min** (GitHub Actions) |
| Deployment frequency | **Continuous** (per merge to `main`, Vercel) |

## 🚀 Engineering Highlights 🚀

- Cut dashboard database round-trips from **6 to 1 (~83%)** with a single MongoDB `$facet` aggregation, plus a compound index to eliminate collection scans.
- Built a **CI pipeline** (GitHub Actions) with **25** unit + integration tests at **~83% coverage** and a coverage gate — **100%** pass rate.
- Implemented **server-side pagination** (10 records/page), bounding API payloads regardless of dataset size.
- **Containerized** the full stack with multi-stage Docker builds and documented the API with **OpenAPI / Swagger**.

---

## 💻 Happy Coding! 😊🚀
