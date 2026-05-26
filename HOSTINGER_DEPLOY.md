# Hostinger Deployment Guide — Golden Dollar Consultancy

## Prerequisites
- Hostinger **VPS** or **Cloud Hosting** plan (shared hosting does NOT support Next.js)
- Node.js 18+ installed on the server
- SSH access to your server

---

## 1. Generate the Deployment ZIP

Run on your local machine:
```bash
node scripts/createDeployment.cjs
```
This verifies the local build compiles cleanly, then creates `gdc-deploy.zip` containing
**source files only** (no pre-built `.next` or `node_modules`). The server builds fresh on
Linux, which avoids Windows-path artifacts that cause TypeScript errors during Linux builds.

---

## 2. Upload to Hostinger

### Via SCP (SSH)
```bash
scp gdc-deploy.zip username@your-server-ip:/home/username/gdc/
ssh username@your-server-ip
cd /home/username/gdc && unzip -o gdc-deploy.zip
```

### Via Hostinger File Manager
1. Log in to hPanel → **Files** → **File Manager**
2. Navigate to `/home/<username>/domains/<yourdomain.com>/public_html`
3. Upload `gdc-deploy.zip` and extract it

---

## 3. Install Dependencies on Server

```bash
cd /home/username/gdc
npm install --legacy-peer-deps
```

---

## 4. Set Environment Variables

Create `/home/username/gdc/.env.local`:
```env
# NextAuth
NEXTAUTH_SECRET=<generate with: openssl rand -hex 32>
NEXTAUTH_URL=https://yourdomain.com

# Database (switch to PostgreSQL for production)
DATABASE_URL="file:./prod.db"
# For PostgreSQL: DATABASE_URL="postgresql://user:pass@localhost:5432/gdc"

# Dropbox
DROPBOX_ACCESS_TOKEN=<your_dropbox_long-lived_token>

# Seed passwords (used only when running prisma/seed.ts)
ADMIN_SEED_PASSWORD=<strong_admin_password>
IT_SEED_PASSWORD=<strong_it_password>
```

---

## 5. Build the Application on the Server

```bash
cd /home/username/gdc

# If re-deploying: clear any stale build artifacts first
rm -rf .next

# Generate Prisma client and compile Next.js
npm run build
```

The `npm run build` command runs `prisma generate` then the Next.js build.
Building on the Linux server ensures `.next/types/` is generated for Linux paths,
avoiding the TypeScript module-resolution errors that occur when a Windows-built
`.next` is transferred to a Linux server.

---

## 6. Initialize the Database

```bash
cd /home/username/gdc
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

This creates:
- **Admin account:** priti@goldendollarconsulting.com (role: admin)
- **IT Support account:** itsupport@goldendollarconsulting.com (role: it_support)

> Change passwords immediately after first login.

---

## 7. Start the Server

### Using PM2 (recommended)
```bash
npm install -g pm2
pm2 start "next start" \
  --name gdc \
  --cwd /home/username/gdc
pm2 save
pm2 startup
```

### Using systemd
Create `/etc/systemd/system/gdc.service`:
```ini
[Unit]
Description=Golden Dollar Consultancy
After=network.target

[Service]
Type=simple
User=username
WorkingDirectory=/home/username/gdc
ExecStart=/usr/bin/npx next start
Restart=on-failure
Environment=NODE_ENV=production
EnvironmentFile=/home/username/gdc/.env.local

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl enable gdc
sudo systemctl start gdc
```

---

## 8. Configure Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 9. SSL Certificate (Free via Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 10. Post-Deployment Checklist

- [ ] Site loads at `https://yourdomain.com`
- [ ] `/portal/login` → login with seeded admin account
- [ ] Admin redirected to `/admin` dashboard
- [ ] Client registration creates user at `/portal/register`
- [ ] File upload works (requires valid `DROPBOX_ACCESS_TOKEN`)
- [ ] Contact page shows correct phone and address
- [ ] HTTPS certificate active

---

## Dashboard URLs

| Dashboard | URL | Access |
|-----------|-----|--------|
| Client Portal | `/portal` | Registered clients |
| Owner/Admin | `/admin` | priti@goldendollarconsulting.com |
| IT Support | `/it-support` | IT support team |

---

## Re-deploying Updates

When pushing an update:
```bash
# Local: generate a new ZIP
node scripts/createDeployment.cjs

# Server: upload and re-extract
scp gdc-deploy.zip username@your-server-ip:/home/username/gdc/
ssh username@your-server-ip
cd /home/username/gdc
unzip -o gdc-deploy.zip
npm install --legacy-peer-deps
rm -rf .next
npm run build
pm2 restart gdc
```

---

## Production Database (Recommended)

For production, switch from SQLite to PostgreSQL:

1. Provision a PostgreSQL database (Hostinger offers managed MySQL/PostgreSQL)
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `DATABASE_URL` in `.env.local`
4. Run `npx prisma db push && npx prisma db seed`

---

## Support Contacts

- **Owner:** priti@goldendollarconsulting.com · +1 (469) 269-9784
- **Office:** 3730 Graham Way SW, Lilburn GA 30047
- **IT Support:** itsupport@goldendollarconsulting.com
