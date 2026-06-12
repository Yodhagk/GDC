'use strict';
/**
 * Creates a deployable ZIP for Hostinger Node.js hosting.
 * Run: npm run deploy:zip
 *
 * Ships pre-built .next (excluding cache) + source files + Unix permissions.
 * Hostinger shared hosting lacks resources to run `next build` on the server,
 * so we build locally on Windows and ship the compiled output.
 * Server only needs: npm install (for Linux Prisma binary) + prisma setup + npm start
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'gdc-deploy.zip');

// Source directories (needed for Prisma CLI, seed, scripts)
const SOURCE_DIRS = ['prisma', 'public', 'scripts'];

// Individual source files
const FILES = [
  'server.js',
  'package.json',
  'package-lock.json',
  'next.config.mjs',
  'tsconfig.json',
  'postcss.config.mjs',
  'tailwind.config.ts',
  '.npmrc',
  'HOSTINGER_DEPLOY.md',
];

// Delete BUILD_ID so smartBuild.cjs always runs a full local compile
const BUILD_ID = path.join(ROOT, '.next', 'BUILD_ID');
if (fs.existsSync(BUILD_ID)) fs.unlinkSync(BUILD_ID);

// Build locally first to ensure .next is fresh and clean
console.log('🏗  Building production bundle locally...');
try {
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
  console.log('[READY] Build complete.\n');
} catch {
  console.error('[FAILED] Build failed. Fix errors before packaging.');
  process.exit(1);
}

console.log('📦 Creating deployment ZIP with Unix permissions...');

if (fs.existsSync(OUT)) fs.unlinkSync(OUT);

async function createZip() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(OUT);
    const archive = archiver('zip', { zlib: { level: 6 } });

    output.on('close', resolve);
    output.on('error', reject);
    archive.on('error', reject);
    archive.pipe(output);

    // ── Pre-built .next (exclude cache — not needed at runtime) ──────────────
    const nextDir = path.join(ROOT, '.next');
    if (fs.existsSync(nextDir)) {
      archive.directory(nextDir, '.next', (entry) => {
        // Skip build cache — saves space, not needed for `next start`
        if (entry.name && (entry.name === 'cache' || entry.name.startsWith('cache/'))) {
          return false;
        }
        entry.mode = entry.stats.isDirectory() ? 0o755 : 0o644;
        return entry;
      });
    }

    // ── Source directories (Prisma schema, seed, public assets, scripts) ─────
    for (const dir of SOURCE_DIRS) {
      const src = path.join(ROOT, dir);
      if (!fs.existsSync(src)) continue;
      archive.directory(src, dir, (entry) => {
        entry.mode = entry.stats.isDirectory() ? 0o755 : 0o644;
        return entry;
      });
    }

    // ── Individual config files ───────────────────────────────────────────────
    for (const file of FILES) {
      const src = path.join(ROOT, file);
      if (!fs.existsSync(src)) continue;
      archive.file(src, { name: file, mode: 0o644 });
    }

    archive.finalize();
  });
}

createZip()
  .then(() => {
    const size = (fs.statSync(OUT).size / 1024 / 1024).toFixed(1);
    console.log(`\n[READY] Deployment package created: gdc-deploy.zip (${size} MB)`);
    console.log('Contains: pre-built .next + source files (no node_modules)');
    console.log('[READY] Unix permissions embedded: dirs=755, files=644');
    console.log('[READY] Server steps: npm install → prisma setup → npm start (NO build needed)');
    console.log('\n[INFO] See HOSTINGER_DEPLOY.md for full deployment steps.');
  })
  .catch((err) => {
    console.error('[FAILED] ZIP creation failed:', err.message);
    process.exit(1);
  });
