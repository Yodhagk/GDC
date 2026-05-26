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
This builds the project and creates `gdc-deploy.zip`.

---

## 2. Upload to Hostinger

### Via Hostinger File Manager
1. Log in to hPanel → **Files** → **File Manager**
2. Navigate to `/home/<username>/domains/<yourdomain.com>/public_html`
3. Upload `gdc-deploy.zip` and extract it

### Via SCP (SSH)
```bash
scp gdc-deploy.zip username@your-server-ip:/home/username/gdc/
ssh username@your-server-ip
cd /home/username/gdc && unzip gdc-deploy.zip
```

---

## 3. Install Production Dependencies on Server

```bash
cd /home/username/gdc
npm install --omit=dev --legacy-peer-deps
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

## 5. Initialize the Database

```bash
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

This creates:
- **Admin account:** priti@goldendollarconsulting.com (role: admin)
- **IT Support account:** itsupport@goldendollarconsulting.com (role: it_support)

> Change passwords immediately after first login.

---

## 6. Start the Server

### Using PM2 (recommended)
```bash
npm install -g pm2
pm2 start "node -r ./scripts/patchFs.cjs ./node_modules/next/dist/bin/next start" \
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
ExecStart=/usr/bin/node -r ./scripts/patchFs.cjs ./node_modules/next/dist/bin/next start
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

## 7. Configure Nginx Reverse Proxy

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

## 8. SSL Certificate (Free via Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 9. Post-Deployment Checklist

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
