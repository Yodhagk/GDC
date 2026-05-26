# Golden Dollar Consultancy — Deployment Guide

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend + Backend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v4 (JWT, credentials) |
| Database | SQLite via Prisma (upgrade to Postgres for production) |
| File Storage | Dropbox API v10 |
| Language | TypeScript |

---

## Local Development

### 1. Prerequisites
- Node.js 18+ (`node --version`)
- npm 9+

### 2. Clone & Install
```bash
git clone <your-repo-url>
cd GDC
npm install
```

### 3. Environment Variables
Copy the example file and fill in your values:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
DROPBOX_ACCESS_TOKEN=<see Dropbox setup below>
```

### 4. Initialize Database
```bash
npm run db:push     # Creates the SQLite database and tables
npm run db:generate # Generates Prisma client
```

### 5. Run Development Server
```bash
npm run dev
# → http://localhost:3000
```

---

## Dropbox API Setup

### Getting an Access Token (Quick Start)
1. Go to [https://www.dropbox.com/developers/apps](https://www.dropbox.com/developers/apps)
2. Click **Create app**
3. Select **Scoped access** → **Full Dropbox**
4. Name your app (e.g., `GoldenDollarConsultancy`)
5. Under **Permissions**, enable:
   - `files.content.write`
   - `files.content.read`
6. Under **Settings** → **OAuth 2**, click **Generate access token**
7. Copy the token into `DROPBOX_ACCESS_TOKEN`

> ⚠️ The generated token expires after a few hours. For production, use a refresh token (see below).

### Production OAuth2 (Refresh Token)
For long-lived access, generate a refresh token:
```bash
# 1. Get authorization URL
# https://www.dropbox.com/oauth2/authorize?client_id=<APP_KEY>&token_access_type=offline&response_type=code

# 2. Exchange the code for refresh token
curl -X POST https://api.dropboxapi.com/oauth2/token \
  -d code=<AUTH_CODE> \
  -d grant_type=authorization_code \
  -d client_id=<APP_KEY> \
  -d client_secret=<APP_SECRET>
```

Then update `lib/dropbox.ts` to use the `Dropbox` constructor with `clientId`, `clientSecret`, and `refreshToken`.

---

## Deploying to Production

### Frontend → Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Framework preset: **Next.js** (auto-detected)
4. Add environment variables in Vercel dashboard:
   ```
   NEXTAUTH_SECRET=<strong-random-secret>
   NEXTAUTH_URL=https://your-domain.vercel.app
   DATABASE_URL=<see database section>
   DROPBOX_ACCESS_TOKEN=<your-token>
   ```
5. Click **Deploy**

### Database for Production

SQLite is file-based and doesn't work on Vercel (ephemeral filesystem). Switch to:

**Option A: PlanetScale (MySQL-compatible, free tier)**
```env
DATABASE_URL="mysql://<user>:<pass>@<host>/<db>?sslaccept=strict"
```
Update `prisma/schema.prisma` → `provider = "mysql"` 

**Option B: Neon (PostgreSQL, free tier)**
```env
DATABASE_URL="postgresql://<user>:<pass>@<host>/<db>?sslmode=require"
```
Update `prisma/schema.prisma` → `provider = "postgresql"`

**Option C: Turso (LibSQL/SQLite-compatible)**
```env
DATABASE_URL="libsql://<db>.turso.io?authToken=<token>"
```

After changing provider, run: `npm run db:push`

### Backend → Render (if separate server needed)
If you need a standalone Node.js server:
1. Connect repo to [render.com](https://render.com)
2. Choose **Web Service** → Node runtime
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npm start`
5. Add the same environment variables

---

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is at least 32 characters, random
- [ ] `DROPBOX_ACCESS_TOKEN` is stored as an env variable, never in code
- [ ] `.env.local` is in `.gitignore`
- [ ] Switch to production Postgres/MySQL database
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set `NEXTAUTH_URL` to production domain (not localhost)
- [ ] File uploads are validated by MIME type and size server-side

---

## Project Structure

```
GDC/
├── app/
│   ├── (marketing)/          # Public pages (/, /about, /services, /contact)
│   │   ├── layout.tsx        # Navbar + Footer wrapper
│   │   ├── page.tsx          # Home page
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   └── contact/page.tsx
│   ├── portal/               # Client portal
│   │   ├── layout.tsx        # Minimal portal header
│   │   ├── page.tsx          # Dashboard (auth required)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │   ├── register/route.ts            # User registration
│   │   ├── upload/route.ts              # Dropbox upload
│   │   └── files/
│   │       ├── route.ts                 # List user files
│   │       └── download/route.ts        # Temp download link
│   ├── globals.css
│   └── layout.tsx                       # Root layout + providers
├── components/                          # Reusable UI components
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── dropbox.ts            # Dropbox SDK wrapper
│   ├── prisma.ts             # Database client singleton
│   └── utils.ts              # Helpers
├── middleware.ts             # Route protection
├── prisma/schema.prisma      # Database schema
└── types/next-auth.d.ts     # Type augmentation
```
