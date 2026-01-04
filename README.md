# Job Portal with JWT Authentication

A minimal job portal example showing JWT auth and role-based access using Express and lowdb.

## Features ✅
- Admin and member roles
- Public job listing at `GET /jobs`
- Authenticated REST API under `/api/*` (JWT required)
- Admin: create/update/delete jobs and manage users
- Member: apply to jobs

## Prerequisites 🔧
- Node.js (>= 16)
- npm

## Installation & quick start 🚀
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   # then set JWT_SECRET in .env
   ```
3. Start in development mode:
   ```bash
   npm run dev
   ```
4. Open public jobs: `http://localhost:3000/jobs`

## Default credentials (first run) 🔐
- username: `admin`
- password: `admin123`

> The server will create this admin automatically if the DB is empty.

## API Endpoints 📡
- Public
  - `GET /jobs` — public job list
- Auth (JWT)
  - `POST /auth/register` — register { username, password }
  - `POST /auth/login` — login { username, password } → returns token
- Jobs (authenticated)
  - `GET /api/jobs` — list jobs (any authenticated user)
  - `GET /api/jobs/:id` — job details
  - `POST /api/jobs` — create job (**admin only**)
  - `PUT /api/jobs/:id` — update job (**admin only**)
  - `DELETE /api/jobs/:id` — delete job (**admin only**)
  - `POST /api/jobs/:id/apply` — apply to job (**member only**)

## Development notes 🧪
- Database: `lowdb` saved to `db/db.json` (for demo only)
- Change `JWT_SECRET` in `.env` before deploying

## Recommended next steps ✨
- Add `.gitignore` (ignore `node_modules` and `.env`)
- Replace `lowdb` with a real DB for production

## License
MIT

