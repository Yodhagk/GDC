'use strict';
/**
 * Hostinger build script — replaces `npm run build` in Hostinger's CI.
 * Hostinger shared hosting cannot run `next build` (thread limit causes crash).
 * The pre-built .next is committed to git, so only prisma generate is needed.
 */
const { execSync } = require('child_process');

console.log('⚙️  Running Hostinger build (prisma generate only — .next is pre-built)');

try {
  execSync('node node_modules/prisma/build/index.js generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated.');
} catch (e) {
  console.warn('⚠️  Prisma generate warning (non-fatal):', e.message);
}

console.log('✅ Hostinger build complete. App will start with pre-built .next');
