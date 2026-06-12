'use strict';
/**
 * Belt-and-suspenders fallback: fixes Unix permissions before Next.js build.
 * Primary fix is the ZIP itself (archiver sets mode bits at creation time).
 * This script handles edge cases where a manual extract strips permissions.
 * No-op on Windows.
 */
if (process.platform === 'win32') process.exit(0);

const { execSync } = require('child_process');

try {
  // chmod -R on the project root applies permissions top-down:
  // parent dirs get execute before child dirs are traversed.
  // a+rX  = read for all + execute ONLY on directories (capital X)
  execSync('chmod -R a+rX . 2>/dev/null || true', { stdio: 'inherit', shell: true, cwd: process.cwd() });
  // Restrict file read to owner+group only for .env files (extra safety)
  execSync('find . -maxdepth 1 -name ".env*" -exec chmod 600 {} + 2>/dev/null || true', { stdio: 'inherit', shell: true });
  console.log('[READY] Permissions ready.');
} catch (e) {
  console.warn('[WARNING]  chmod warning (non-fatal):', e.message);
}
