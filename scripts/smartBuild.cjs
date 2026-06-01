'use strict';
/**
 * Smart build script — replaces `npm run build`.
 *
 * On Hostinger: .next/BUILD_ID exists in the ZIP → only runs prisma generate,
 *   skips the heavy next build (which crashes on shared hosting thread limits).
 *
 * Locally / CI: .next/BUILD_ID is deleted by createDeployment.cjs before this
 *   runs → performs the full prisma generate + next build.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BUILD_ID = path.join(ROOT, '.next', 'BUILD_ID');
const preBuilt = fs.existsSync(BUILD_ID);

// Fix permissions on Linux before anything else
if (process.platform !== 'win32') {
  try {
    execSync('chmod -R a+rX . 2>/dev/null || true', { shell: true, stdio: 'pipe' });
  } catch {}
}

// Always regenerate Prisma client
console.log('⚙️  Generating Prisma client...');
execSync('node node_modules/prisma/build/index.js generate', { stdio: 'inherit' });

if (preBuilt) {
  console.log('✅ Pre-built .next detected — skipping Next.js compilation.');
  console.log('   (Hostinger shared hosting mode: .next shipped in ZIP)');
  process.exit(0);
}

// Full Next.js build (local or fresh server build)
console.log('🏗  Running full Next.js build...');
execSync(
  'node -r ./scripts/patchFs.cjs ./node_modules/next/dist/bin/next build',
  { stdio: 'inherit' }
);
