# Job Portal with JWT Authentication

This is a simple job portal example using Express, JWT, and lowdb.

Features:
- Admin and member roles
- Public job listing at `GET /jobs`
- Authenticated REST API under `/api/*` (JWT required)
- Admin can manage jobs and users
- Members can apply to jobs

Quick start:
1. Copy `.env.example` to `.env` and set `JWT_SECRET`.
2. npm install
3. npm run dev

Default admin user created on first run:
- username: admin
- password: admin123

Sample requests:
- Register: POST /auth/register { username, password }
- Login: POST /auth/login { username, password } -> returns token
- Public jobs: GET /jobs
- API jobs (requires Authorization: Bearer <token>):
  - GET /api/jobs
  - POST /api/jobs (admin)
  - POST /api/jobs/:id/apply (member)

Security notes:
- This is an example; do not use in production as-is.
- Use a strong `JWT_SECRET` and persist a real database.
