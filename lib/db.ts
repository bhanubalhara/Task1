import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function initDatabase() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      code VARCHAR(8) UNIQUE NOT NULL,
      url TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_clicked_at TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
  `);
}

