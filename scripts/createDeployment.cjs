'use strict';
/**
 * Creates a deployable ZIP for Hostinger VPS / Node.js hosting.
 * Run: node scripts/createDeployment.cjs
 * Requires: npm install (to have the zip package available) or uses built-in archiving.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'gdc-deploy.zip');

// Files / folders to include in the deployment package
const INCLUDE = [
  '.next',
  'public',
  'prisma',
  'scripts',
  'pages',
  'package.json',
  'package-lock.json',
  'next.config.mjs',
  'tsconfig.json',
  'postcss.config.mjs',
  'tailwind.config.ts',
  'HOSTINGER_DEPLOY.md',
];

console.log('🏗  Building production bundle...');
try {
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
} catch {
  console.error('❌ Build failed. Fix errors before packaging.');
  process.exit(1);
}

// Try using PowerShell's Compress-Archive on Windows, fallback to zip CLI
console.log('\n📦 Creating deployment ZIP...');

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
console.log('📖 See HOSTINGER_DEPLOY.md for upload and configuration steps.');
