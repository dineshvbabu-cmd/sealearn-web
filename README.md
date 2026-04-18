# SeaLearn Web

SeaLearn Web is a Next.js 16 and Prisma application that currently powers the SeaLearn admin, portal, CMS, and LMS workflows. This repository now also includes a first-pass **VIR (Vessel Inspection Report) foundation** for QHSE review and phased implementation.

## What was added for VIR

- A normalized Prisma domain model for vessels, inspection types, questionnaire templates, answers, findings, corrective actions, sign-off, and import audit.
- A structured questionnaire import pipeline for dry-run validation and database commit.
- A seed route for the VIR inspection catalogue and a starter PSC questionnaire.
- A management review page at `/admin/vir`.

## Stack

- Next.js 16.2
- React 19
- Prisma 6
- PostgreSQL
- NextAuth 5 beta
- Tailwind CSS 4
- Railway for hosting

## Open In Visual Studio Code

This repo is a **Next.js / TypeScript** application, so I assumed "visual basic code" meant **Visual Studio Code**, not Visual Basic .NET.

1. Open VS Code.
2. Choose `File -> Open Folder`.
3. Open this folder:

```text
d:\OneDrive - Union Maritime Limited\Documents\Copilot\sealearn-web
```

4. Open a terminal in VS Code and run the setup commands below.

## Local Setup

### Requirements

- Node.js 20.9 or newer
- npm
- PostgreSQL connection string for `DATABASE_URL`

### Environment

Create your local environment file from the template:

```powershell
Copy-Item .env.example .env.local
```

Then fill in the real values in `.env.local`.

### Install and Run

```powershell
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

## Useful Local Routes

- Admin login: `/auth/admin-login`
- Admin dashboard: `/admin/dashboard`
- VIR management review: `/admin/vir`
- General seed route: `/api/seed?secret=YOUR_SEED_SECRET`
- VIR seed route: `/api/seed-vir?secret=YOUR_SEED_SECRET`

## VIR Template Import

### Dry-run validation

Send a `POST` request to:

```text
/api/vir/templates/import
```

This validates the JSON payload and returns:

- normalized template structure
- summary counts
- warnings such as missing option sets or missing high-risk mandatory questions

### Commit to database

Send the same payload to:

```text
/api/vir/templates/import?commit=true
```

This will:

1. Upsert the VIR inspection type.
2. Create the questionnaire template.
3. Create sections, questions, and options in one pass.

The starter payload is shown on `/admin/vir`.

## GitHub Workflow

This repository already has a GitHub remote configured:

```text
https://github.com/dineshvbabu-cmd/sealearn-web.git
```

### Push changes

```powershell
git status
git add .
git commit -m "Add VIR module foundation and import engine"
git push origin main
```

If you prefer a feature branch:

```powershell
git checkout -b feature/vir-module-foundation
git push -u origin feature/vir-module-foundation
```

## Railway Deployment

Recommended source material from Railway:

- Next.js guide: https://docs.railway.com/guides/nextjs
- Variables: https://docs.railway.com/variables

### Deploy from GitHub

1. Create a new Railway project.
2. Choose `Deploy from GitHub repo`.
3. Select `sealearn-web`.
4. Add a PostgreSQL service in the same Railway project.
5. In the web service variables, add a **reference variable** for `DATABASE_URL` from the PostgreSQL service.
6. Add the remaining environment variables from `.env.example`.
7. In Railway service settings, set the pre-deploy command to:

```text
npx prisma migrate deploy
```

8. Deploy the service.
9. Generate a public domain from the Railway networking settings.

### Important deployment notes

- This app now uses `output: "standalone"` in `next.config.ts`, which is Railway-friendly for self-hosted Next.js deployments.
- `DATABASE_URL` should come from the Railway Postgres service reference, not a copied raw password string where possible.
- `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` must match the live Railway domain or your custom domain.
- Keep `.env.local` local only. Do not commit secrets.

## Suggested Railway Variables

At minimum, configure:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `SEED_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional but likely needed in this project:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `NEXT_PUBLIC_R2_PUBLIC_URL`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

## Management Review Notes

- The supplied VIR HTML spec says there are 54 inspection types, but the extracted list contains 59. That should be confirmed before sign-off.
- The current implementation is the right **foundation** for management review and phase planning, not yet the finished full offline/PDF-import product.
- The fastest safe route is to continue inside this Next.js app, then add AI import, dashboards, and mobile/offline flows in later phases.
