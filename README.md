# Pranav — Developer Portfolio

A Next.js App Router portfolio with a separate Express/MongoDB API and protected admin dashboard.

## Stack

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- API: Express 4, Mongoose, JWT in HTTP-only cookies
- Storage: MongoDB Atlas and Cloudinary

## Requirements

- Node.js 20 or newer (Node 22 recommended)
- MongoDB database
- Cloudinary account for image and resume uploads

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and set real values.
2. Copy `frontend/.env.example` to `frontend/.env.local`.
3. Install dependencies in each app: `cd backend && npm install`, then `cd ../frontend && npm install`. Commit the generated `package-lock.json` files after dependency review so deployments can use reproducible `npm ci` installs.
4. Seed the initial admin and editable portfolio records: `cd backend && npm run seed`.
5. Start the API: `cd backend && npm run dev`.
6. In another terminal start Next.js: `cd frontend && npm run dev`.
7. Visit `http://localhost:3000` and `http://localhost:3000/admin`.

The seed script creates or updates the admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Use a unique password of at least 14 characters. Do not run the seed script repeatedly in production unless you intentionally want to reset the admin password to the configured value.

## Environment variables

### Backend

- `PORT`: API port (default 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: random secret, minimum 32 characters; use a unique 64+ character value in production
- `CLIENT_URL`: comma-separated exact allowed frontend origins, e.g. `https://www.example.com`
- `COOKIE_SAME_SITE`: normally `lax`; set `none` only for genuinely cross-site HTTPS frontend/API deployments
- `NODE_ENV`: `development` or `production`
- `CLOUDINARY_URL`: Cloudinary connection URL
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: initial admin credentials for seed

### Frontend

- `NEXT_PUBLIC_API_URL`: API base including `/api`, e.g. `https://api.example.com/api`
- `NEXT_PUBLIC_SITE_URL`: canonical public website origin, e.g. `https://www.example.com`

Never commit `.env`, `.env.local`, credentials, or private keys.

## Production deployment

Recommended arrangement: `www.yourdomain.com` for Next.js and `api.yourdomain.com` for Express. These are same-site subdomains, so keep `COOKIE_SAME_SITE=lax` and enable HTTPS on both. Configure the exact `CLIENT_URL` origin, frontend API URL and canonical site URL. If you instead use unrelated registrable domains, browser third-party-cookie restrictions may affect admin sessions; test all supported browsers before launch.

Deploy the frontend to Vercel and the API to a Node host. Configure MongoDB Atlas network access to the API host and use a least-privilege database user. Configure Cloudinary upload limits and backups. Set health monitoring against `/health`.

## Before publishing portfolio content

The seed script creates project drafts with `published: false` so unverified copy is not shown publicly. Open `/admin`, verify every project description, technology, role, personal contribution, screenshot, GitHub URL and live URL, then explicitly publish it. No certification is seeded without confirmed credential information. Add only qualifications and measurable results that can be substantiated.

The profile's seeded contact email and internship information should also be checked before making the site public. Add your actual ATS-friendly PDF through Admin → Resume. The site does not create or fabricate a resume.

## Verification commands

Run in `backend`:

```bash
npm install
npm run check
node --check server.js
node --check routes/index.js
node --check models/index.js
node --check scripts/seed.js
```

Run in `frontend`:

```bash
npm install
npm run typecheck
npm run build
```

Then test with a staging database and Cloudinary account: login, logout, expired session, every admin CRUD route, image upload rejection for SVG/renamed files, resume upload/download, contact rate limiting, and mobile admin behavior. Do not treat a successful build as a substitute for these integration tests.

## Security notes

- All admin writes require a valid signed JWT cookie.
- Browser-originated writes are checked against the CORS origin allowlist.
- Image uploads accept JPEG, PNG and WebP and check file signatures.
- Resume uploads require a PDF signature; downloads are bounded and validated.
- Use HTTPS, strong unique secrets, least-privilege database credentials, backups, and monitoring.
- Contact messages contain personal information. Restrict admin access and define a retention/deletion policy.
