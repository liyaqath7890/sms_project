import bcrypt from 'bcryptjs';
import pool from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedDefaultUser() {
  const email = 'ifra@gmail.com';
  const password = 'Ifra@123';
  const role = 'admin';

  try {
    // Check if user exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('✅ Default user ifra@gmail.com already exists. Skipping.');
      process.exit(0);
    }

    // Hash password
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);

    // Insert user
    await pool.query(
      'INSERT INTO users (email, password_hash, role, is_active) VALUES ($1, $2, $3, true)',
      [email, hash, role]
    );

    console.log(`✅ Success! Default admin created:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`\n📱 Now you can login at http://localhost:5173/auth/login`);
    console.log(`🚀 Start servers: cd backend && node server.js , then npm run dev`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    if (err.code === '42P01') {
      console.log('💡 Run backend/config/schema.sql first to create tables!');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDefaultUser();

