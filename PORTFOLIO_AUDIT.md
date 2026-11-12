# Pranav Portfolio — Follow-up Engineering Audit

Date: 8 November 2026

## Executive status

The reviewed archive has received a second hardening and UX pass. Static JavaScript syntax checks and TypeScript/TSX syntax transpilation pass. A complete dependency install, full TypeScript type-check, Next.js production build, npm vulnerability audit, and live API/database/Cloudinary tests could not be completed because npm registry DNS resolution failed (`EAI_AGAIN registry.npmjs.org`). The application must therefore still be treated as **staging-only, not production-certified**.

## Changes in this pass

### Backend security and reliability

- Added resource-specific field allowlists for profile, settings, projects, skills, experience, education, and certifications; unknown client fields are discarded.
- Added basic field, URL, array-length, and sort-order validation for editable resources.
- Added MongoDB ObjectId validation and consistent not-found responses for delete/message operations.
- Added duplicate-key conflict responses and Mongoose validation/cast error handling.
- Added browser-origin checks on state-changing requests in addition to CORS.
- Made cookie SameSite configurable and documented the preferred same-site custom-subdomain deployment.
- Restricted image MIME types to JPEG/PNG/WebP and added file-signature checks to reject renamed files and SVG.
- Added PDF signature and size checks for resume uploads.
- Hardened resume download: only trusted Cloudinary HTTPS URLs, upstream status/content-type checks, timeout, streaming size cap, PDF signature verification, and download count increment after successful validation.
- Added graceful SIGTERM/SIGINT shutdown and startup configuration validation.
- Improved project slug regeneration when a title is edited without a supplied slug.
- Enforced a 14-character minimum for the seeded admin password.

### Frontend and content workflow

- Added explicit light/dark theme toggle with persisted user preference and class-based Tailwind dark mode.
- Added profile initials fallback when no portrait has been uploaded.
- Project filter categories are now derived from the actual project records, rather than a fixed hard-coded list.
- Added loading, error, and 404 screens.
- Improved admin list, singleton, and dashboard loading/error feedback.
- Restricted admin image picker to JPEG/PNG/WebP.
- Corrected resume control wording to indicate that the current file downloads.

### Seed-data integrity

- Removed the unverified Quick Service project and unverified AI Fluency certification from the seed data.
- Seeded project records now default to `published: false`, requiring the owner to verify descriptions, technology lists, links, and personal contributions before publishing.
- Generic project copy remains intentionally marked as draft; replace it with factual project-specific descriptions.

### Documentation

- Expanded README with local setup, environment variables, deployment topology, security guidance, seed-data verification, and test commands.
- Added Node.js engine requirements and backend check/frontend typecheck scripts.

## Verification performed

- `node --check` passed for backend server, routes, models, and seed script.
- TypeScript compiler `transpileModule` syntax pass completed for 20 frontend `.ts`/`.tsx` files.
- JSON parsing passed for project package/config files.
- ZIP integrity check passed after packaging.

## Verification not completed

- `npm install` failed because the environment could not resolve `registry.npmjs.org` (`EAI_AGAIN`).
- Full TypeScript type-check is blocked by missing installed Next.js/React/type dependencies. The attempted check reported missing modules/types and related type errors; do not interpret it as a clean type-check.
- Next.js production build not run.
- `npm audit` not run; dependency vulnerability status is unknown. The pinned Next.js 14.2.15 baseline is old and must be reviewed/upgraded with compatibility testing before public deployment.
- No live MongoDB, Cloudinary, email, or browser integration tests were possible.
- No responsive visual QA or accessibility audit was run in a browser.

## Required release gates

1. Install dependencies in both packages and commit package-lock files.
2. Review/upgrade dependencies and resolve all high/critical npm audit findings.
3. Run frontend type-check and production build.
4. Test all admin CRUD operations and authorization against staging MongoDB.
5. Test image/PDF uploads, invalid file rejection, resume download, and Cloudinary deletion behavior.
6. Test login/logout/session expiry and cookie behavior on Chrome, Firefox, Safari, and mobile browsers using the intended production domain arrangement.
7. Verify seeded personal information, internship dates, project claims, project technologies, links, and certifications with the owner.
8. Add the actual ATS-friendly PDF resume and verify text extraction and formatting.
9. Complete keyboard, contrast, screen-reader, reduced-motion, and responsive visual testing.
10. Configure database backups, error monitoring, uptime monitoring, privacy/retention policy for contact messages, and production secrets.

## Important deployment note

Preferred production topology is `www.example.com` (Next.js) and `api.example.com` (Express), both HTTPS and under the same registrable domain. Keep `COOKIE_SAME_SITE=lax` for this arrangement. Do not switch to `SameSite=None` unless the frontend and API are genuinely cross-site and browser cookie behavior has been explicitly tested.
