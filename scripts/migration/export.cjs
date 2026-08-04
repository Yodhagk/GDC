'use strict';
/**
 * Step 1 of 2: dump every row from the SQLite prod.db to a JSON file.
 * Kept in a separate process from import.cjs — loading the sqlite and mysql
 * Prisma query engines in the same Node process causes a Rust/Tokio panic.
 *
 *   SQLITE_DATABASE_URL=file:/abs/path/to/prod.db node scripts/migration/export.cjs
 */
const fs = require('fs');
const path = require('path');

const sqliteUrl = process.env.SQLITE_DATABASE_URL;
if (!sqliteUrl) {
  console.error('Set SQLITE_DATABASE_URL first.');
  process.exit(1);
}

const { PrismaClient: SqliteClient } = require('./generated/sqlite-client');
const sqlite = new SqliteClient({ datasources: { db: { url: sqliteUrl } } });

async function main() {
  const users = await sqlite.user.findMany();
  const tickets = await sqlite.ticket.findMany();
  const resetTokens = await sqlite.passwordResetToken.findMany();

  const outPath = path.join(__dirname, 'dump.json');
  fs.writeFileSync(outPath, JSON.stringify({ users, tickets, resetTokens }, null, 2));

  console.log(`Exported ${users.length} users, ${tickets.length} tickets, ${resetTokens.length} reset tokens -> ${outPath}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await sqlite.$disconnect(); });
