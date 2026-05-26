'use strict';
/**
 * Fixes directory/file permissions before the Next.js build on Linux.
 * Windows ZIPs created with PowerShell Compress-Archive strip Unix permission
 * bits, so directories land without the execute bit and Next.js cannot traverse
 * them (EACCES during scandir). This script is a no-op on Windows.
 */
if (process.platform === 'win32') process.exit(0);

const { execSync } = require('child_process');

const targets = [
  'app', 'components', 'lib', 'types', 'pages',
  'prisma', 'public', 'scripts', 'middleware.ts',
].join(' ');

try {
  // Directories need 755, files need 644
  execSync(`find ${targets} -type d -exec chmod 755 {} +`, { stdio: 'inherit', shell: true });
  execSync(`find ${targets} -type f -exec chmod 644 {} +`, { stdio: 'inherit', shell: true });
  console.log('✅ Permissions fixed.');
} catch (e) {
  // Non-fatal — build may still succeed
  console.warn('⚠️  chmod warning (non-fatal):', e.message);
}
