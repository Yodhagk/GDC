'use strict';
/**
 * Creates a deployable ZIP for Hostinger VPS / Node.js hosting.
 * Run: node scripts/createDeployment.cjs
 *
 * Ships SOURCE files only — the server builds fresh on Linux to avoid
 * Windows-path contamination in .next/types/ that breaks Linux TypeScript.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'gdc-deploy.zip');

// Source files and folders to ship — server will run `npm run build` itself
const INCLUDE = [
  'app',
  'components',
  'lib',
  'types',
  'pages',
  'prisma',
  'public',
  'scripts',
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

console.log('📦 Creating deployment ZIP (source files only)...');

if (fs.existsSync(OUT)) fs.unlinkSync(OUT);

const existing = INCLUDE.filter((f) => fs.existsSync(path.join(ROOT, f)));

try {
  // Windows: use PowerShell
  const items = existing.map((f) => `"${path.join(ROOT, f)}"`).join(',');
  execSync(
    `powershell -Command "Compress-Archive -Path ${items} -DestinationPath '${OUT}' -Force"`,
    { cwd: ROOT, stdio: 'inherit' }
  );
} catch {
  try {
    // Unix fallback
    const args = existing.join(' ');
    execSync(`zip -r "${OUT}" ${args}`, { cwd: ROOT, stdio: 'inherit' });
  } catch {
    console.error('❌ Could not create ZIP. Install zip or run on Windows with PowerShell.');
    process.exit(1);
  }
}

const size = (fs.statSync(OUT).size / 1024 / 1024).toFixed(1);
console.log(`\n✅ Deployment package created: gdc-deploy.zip (${size} MB)`);
console.log('   Contains: source files only (no pre-built .next or node_modules)');
console.log('   Server will run: npm install && npm run build && npm start');
console.log('\n📖 See HOSTINGER_DEPLOY.md for full deployment steps.');
