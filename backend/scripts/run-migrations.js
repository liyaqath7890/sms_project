import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../config/migrations');

async function runMigrations() {
  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No migration files found.');
    return;
  }

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, 'utf8');

    console.log(`Running migration: ${file}`);
    await pool.query(sql);
    console.log(`Completed migration: ${file}`);
  }
}

runMigrations()
  .then(async () => {
    console.log('All migrations completed successfully.');
    await pool.end();
  })
  .catch(async (error) => {
    console.error('Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  });
