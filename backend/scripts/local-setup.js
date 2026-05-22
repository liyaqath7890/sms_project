import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const schemaPath = path.join(rootDir, 'backend/config/schema.sql');
const migrationsDir = path.join(rootDir, 'backend/config/migrations');

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT || 5432);

const assertSafeDbName = (name) => {
  if (!/^[a-zA-Z0-9_]+$/.test(name || '')) {
    throw new Error('DB_NAME must contain only letters, numbers, and underscores');
  }
};

const createClient = (database) => new Client({
  host: dbHost,
  port: dbPort,
  database,
  user: dbUser,
  password: dbPassword
});

async function ensureDatabase() {
  assertSafeDbName(dbName);
  const client = createClient('postgres');
  await client.connect();

  const existing = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (existing.rows.length === 0) {
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Created database: ${dbName}`);
  } else {
    console.log(`Database exists: ${dbName}`);
  }

  await client.end();
}

async function tableExists(client, tableName) {
  const result = await client.query(
    `SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    ) as exists`,
    [tableName]
  );

  return result.rows[0].exists;
}

async function runBaseSchema(client) {
  if (await tableExists(client, 'users')) {
    console.log('Base schema already exists.');
    return;
  }

  const schema = await fs.readFile(schemaPath, 'utf8');
  await client.query(schema);
  console.log('Base schema applied.');
}

async function runMigrations(client) {
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
    await client.query(sql);
    console.log(`Migration applied: ${file}`);
  }
}

async function ensureDefaultAdmin(client) {
  const email = 'ifra@gmail.com';
  const password = 'Ifra@123';
  const role = 'admin';
  const existing = await client.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);

  let userId = existing.rows[0]?.id;
  if (!userId) {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await client.query(
      `INSERT INTO users (email, password_hash, role, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING id`,
      [email, passwordHash, role]
    );
    userId = result.rows[0].id;
    console.log('Default admin created: ifra@gmail.com / Ifra@123');
  } else {
    console.log('Default admin already exists.');
  }

  if (await tableExists(client, 'user_roles')) {
    await client.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE slug = $2
       ON CONFLICT DO NOTHING`,
      [userId, role]
    );
  }
}

async function main() {
  await ensureDatabase();

  const client = createClient(dbName);
  await client.connect();

  try {
    await runBaseSchema(client);
    await runMigrations(client);
    await ensureDefaultAdmin(client);
    console.log('Local database setup completed successfully.');
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Local setup failed:', error.message);
  process.exit(1);
});
