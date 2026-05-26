'use strict';
/**
 * Creates a deployable ZIP for Hostinger VPS / Node.js hosting.
 * Run: npm run deploy:zip
 *
 * Ships SOURCE files only — the server builds fresh on Linux.
 * Uses `archiver` to embed proper Unix permission bits (755 dirs, 644 files)
 * so extraction on Linux never triggers EACCES during Next.js build.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'gdc-deploy.zip');

// Source directories to include (server builds .next fresh on Linux)
const DIRS = ['app', 'components', 'lib', 'types', 'pages', 'prisma', 'public', 'scripts'];

// Individual files to include
const FILES = [
  'middleware.ts',
  'package.json',
  'package-lock.json',
  'next.config.mjs',
  'tsconfig.json',
  'postcss.config.mjs',
  'tailwind.config.ts',
  '.npmrc',
  'HOSTINGER_DEPLOY.md',
];

// Verify local build compiles cleanly before packaging
console.log('🔍 Verifying local build compiles cleanly...');
try {
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
  console.log('✅ Build verified clean.\n');
} catch {
  console.error('❌ Build failed. Fix errors before packaging.');
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

    // Add each directory with mode bits stored in the ZIP
    for (const dir of DIRS) {
      const src = path.join(ROOT, dir);
      if (!fs.existsSync(src)) continue;

      archive.directory(src, dir, (entry) => {
        // Directories: rwxr-xr-x (755), Files: rw-r--r-- (644)
        entry.mode = entry.stats.isDirectory() ? 0o755 : 0o644;
        return entry;
      });
    }

    // Add individual files
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
    console.log(`\n✅ Deployment package created: gdc-deploy.zip (${size} MB)`);
    console.log('   Unix permissions embedded: dirs=755, files=644');
    console.log('   Contains: source files only (no pre-built .next or node_modules)');
    console.log('   Server will run: npm install && npm run build && npm start');
    console.log('\n📖 See HOSTINGER_DEPLOY.md for full deployment steps.');
  })
  .catch((err) => {
    console.error('❌ ZIP creation failed:', err.message);
    process.exit(1);
  });
