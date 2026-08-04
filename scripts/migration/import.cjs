'use strict';
/**
 * Step 2 of 2: load dump.json (produced by export.cjs) into MySQL.
 * Kept in a separate process from export.cjs — see note there.
 *
 *   MYSQL_DATABASE_URL="mysql://user:pass@127.0.0.1:3306/db" node scripts/migration/import.cjs
 */
const fs = require('fs');
const path = require('path');

const mysqlUrl = process.env.MYSQL_DATABASE_URL;
if (!mysqlUrl) {
  console.error('Set MYSQL_DATABASE_URL first.');
  process.exit(1);
}

const { PrismaClient: MysqlClient } = require('./generated/mysql-client');
const mysql = new MysqlClient({ datasources: { db: { url: mysqlUrl } } });

// JSON.parse doesn't reconstruct Date objects — do it explicitly per field.
const toDate = (v) => (v == null ? v : new Date(v));

async function main() {
  const dumpPath = path.join(__dirname, 'dump.json');
  const { users, tickets, resetTokens } = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));
  console.log(`Loaded dump: ${users.length} users, ${tickets.length} tickets, ${resetTokens.length} reset tokens.`);

  const existingUsers = await mysql.user.count();
  if (existingUsers > 0) {
    console.error(`MySQL target already has ${existingUsers} users — refusing to run twice. Truncate the target tables first if you intend to re-run.`);
    process.exit(1);
  }

  console.log('Writing users...');
  for (const u of users) {
    await mysql.user.create({
      data: {
        ...u,
        mfaCodeExpires: toDate(u.mfaCodeExpires),
        mfaCodeIssuedAt: toDate(u.mfaCodeIssuedAt),
        createdAt: toDate(u.createdAt),
        updatedAt: toDate(u.updatedAt),
      },
    });
  }

  console.log('Writing tickets...');
  for (const t of tickets) {
    await mysql.ticket.create({
      data: { ...t, createdAt: toDate(t.createdAt), updatedAt: toDate(t.updatedAt) },
    });
  }

  console.log('Writing password reset tokens...');
  for (const r of resetTokens) {
    await mysql.passwordResetToken.create({
      data: { ...r, expires: toDate(r.expires), createdAt: toDate(r.createdAt) },
    });
  }

  const [uc, tc, rc] = await Promise.all([
    mysql.user.count(),
    mysql.ticket.count(),
    mysql.passwordResetToken.count(),
  ]);

  console.log('--- Verification ---');
  console.log(`Dump:  ${users.length} users, ${tickets.length} tickets, ${resetTokens.length} reset tokens`);
  console.log(`MySQL: ${uc} users, ${tc} tickets, ${rc} reset tokens`);

  if (uc !== users.length || tc !== tickets.length || rc !== resetTokens.length) {
    console.error('MISMATCH — do not cut the app over to MySQL. Investigate before proceeding.');
    process.exit(1);
  }

  console.log('OK — row counts match on both sides.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await mysql.$disconnect(); });
