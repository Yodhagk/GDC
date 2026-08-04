'use strict';
/**
 * One-time data copy: SQLite (prod.db) -> MySQL.
 *
 * Run on the server, from the app directory, AFTER generating both
 * throwaway clients (see the runbook). Requires:
 *   SQLITE_DATABASE_URL   e.g. file:./prod.db
 *   MYSQL_DATABASE_URL    e.g. mysql://user:pass@localhost:3306/dbname
 *
 * Copies User -> Ticket -> PasswordResetToken in that order (parents first)
 * so foreign keys resolve, preserving every original id/timestamp. Verifies
 * row counts match on both sides before exiting 0.
 */

const sqliteUrl = process.env.SQLITE_DATABASE_URL;
const mysqlUrl = process.env.MYSQL_DATABASE_URL;

if (!sqliteUrl || !mysqlUrl) {
  console.error('Set SQLITE_DATABASE_URL and MYSQL_DATABASE_URL first.');
  process.exit(1);
}

const { PrismaClient: SqliteClient } = require('./generated/sqlite-client');
const { PrismaClient: MysqlClient } = require('./generated/mysql-client');

const sqlite = new SqliteClient({ datasources: { db: { url: sqliteUrl } } });
const mysql = new MysqlClient({ datasources: { db: { url: mysqlUrl } } });

async function main() {
  console.log('Reading from SQLite...');
  const users = await sqlite.user.findMany();
  const tickets = await sqlite.ticket.findMany();
  const resetTokens = await sqlite.passwordResetToken.findMany();
  console.log(`Found ${users.length} users, ${tickets.length} tickets, ${resetTokens.length} reset tokens.`);

  const existingUsers = await mysql.user.count();
  if (existingUsers > 0) {
    console.error(`MySQL target already has ${existingUsers} users — refusing to run twice. Truncate the target tables first if you intend to re-run.`);
    process.exit(1);
  }

  console.log('Writing users...');
  for (const u of users) await mysql.user.create({ data: u });

  console.log('Writing tickets...');
  for (const t of tickets) await mysql.ticket.create({ data: t });

  console.log('Writing password reset tokens...');
  for (const r of resetTokens) await mysql.passwordResetToken.create({ data: r });

  const [uc, tc, rc] = await Promise.all([
    mysql.user.count(),
    mysql.ticket.count(),
    mysql.passwordResetToken.count(),
  ]);

  console.log('--- Verification ---');
  console.log(`SQLite: ${users.length} users, ${tickets.length} tickets, ${resetTokens.length} reset tokens`);
  console.log(`MySQL:  ${uc} users, ${tc} tickets, ${rc} reset tokens`);

  if (uc !== users.length || tc !== tickets.length || rc !== resetTokens.length) {
    console.error('MISMATCH — do not cut the app over to MySQL. Investigate before proceeding.');
    process.exit(1);
  }

  console.log('OK — row counts match on both sides.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await sqlite.$disconnect();
    await mysql.$disconnect();
  });
