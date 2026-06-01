'use strict';
/**
 * Dropbox Refresh Token Generator
 * ─────────────────────────────────
 * Run: node scripts/getDropboxToken.cjs
 *
 * Prerequisites:
 *  1. Create a Dropbox App at https://www.dropbox.com/developers/apps
 *  2. Set App permissions: files.content.read + files.content.write + files.metadata.read
 *  3. Add redirect URI: http://localhost:3000  (in app settings)
 *  4. Set APP_KEY and APP_SECRET below (or pass as env vars)
 */

const http = require('http');
const { exec } = require('child_process');
const readline = require('readline');

const APP_KEY    = process.env.DROPBOX_APP_KEY    || '';
const APP_SECRET = process.env.DROPBOX_APP_SECRET || '';
const REDIRECT   = 'http://localhost:3001/callback';

if (!APP_KEY || !APP_SECRET) {
  console.log('\n❌  Missing DROPBOX_APP_KEY or DROPBOX_APP_SECRET\n');
  console.log('Usage:');
  console.log('  DROPBOX_APP_KEY=xxx DROPBOX_APP_SECRET=yyy node scripts/getDropboxToken.cjs\n');
  process.exit(1);
}

const authUrl =
  `https://www.dropbox.com/oauth2/authorize` +
  `?client_id=${APP_KEY}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT)}` +
  `&response_type=code` +
  `&token_access_type=offline`; // ← offline = refresh token

console.log('\n📦  Dropbox Refresh Token Generator');
console.log('─'.repeat(50));
console.log('\n1. Opening browser for Dropbox authorization...');
console.log(`\n   Auth URL:\n   ${authUrl}\n`);

// Try to open browser automatically
const cmd = process.platform === 'win32' ? `start "" "${authUrl}"` :
            process.platform === 'darwin' ? `open "${authUrl}"` :
            `xdg-open "${authUrl}"`;
exec(cmd, () => {});

// Start local callback server to capture the code
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3001');
  const code = url.searchParams.get('code');

  if (!code) {
    res.end('<h2>No code received. Please try again.</h2>');
    return;
  }

  res.end(`
    <html><body style="font-family:sans-serif;padding:40px;max-width:600px">
      <h2>✅ Authorization code received!</h2>
      <p>Exchanging for refresh token... check your terminal.</p>
    </body></html>
  `);

  server.close();

  // Exchange authorization code for tokens
  const creds = Buffer.from(`${APP_KEY}:${APP_SECRET}`).toString('base64');
  const body = new URLSearchParams({
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT,
  });

  try {
    const fetch = globalThis.fetch || (await import('node-fetch').then(m => m.default).catch(() => null));
    if (!fetch) { console.error('❌  No fetch available. Use Node 18+.'); process.exit(1); }

    const tokenRes = await fetch('https://api.dropboxapi.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await tokenRes.json();

    if (data.error) {
      console.error('\n❌  Error:', data.error_description || data.error);
      process.exit(1);
    }

    console.log('\n✅  SUCCESS! Add these to your .env.local and Hostinger env vars:\n');
    console.log('─'.repeat(50));
    console.log(`DROPBOX_APP_KEY=${APP_KEY}`);
    console.log(`DROPBOX_APP_SECRET=${APP_SECRET}`);
    console.log(`DROPBOX_REFRESH_TOKEN=${data.refresh_token}`);
    console.log('─'.repeat(50));
    console.log('\n📌  The refresh token never expires (unless you revoke app access).');
    console.log('   Remove DROPBOX_ACCESS_TOKEN from env vars once you add these.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌  Failed to exchange code:', err.message);
    process.exit(1);
  }
});

server.listen(3001, () => {
  console.log('2. Waiting for Dropbox authorization...');
  console.log('   (local server listening on http://localhost:3001)\n');
});
