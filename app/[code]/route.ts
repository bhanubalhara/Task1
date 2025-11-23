import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/db';

// Initialize database on first import
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// Reserved paths that should not be treated as codes
const RESERVED_PATHS = ['api', 'code', 'healthz', '_next', 'favicon.ico'];

// Redirect handler for /:code
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  // Prevent reserved paths from being treated as codes
  if (RESERVED_PATHS.includes(params.code.toLowerCase())) {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }

  try {
    await ensureDbInitialized();
    const pool = getPool();
    
    // Get the link
    const result = await pool.query(
      'SELECT url FROM links WHERE code = $1',
      [params.code]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const url = result.rows[0].url;

    // Increment click count and update last clicked time
    await pool.query(
      'UPDATE links SET clicks = clicks + 1, last_clicked_at = CURRENT_TIMESTAMP WHERE code = $1',
      [params.code]
    );

    // Perform 302 redirect
    return NextResponse.redirect(url, { status: 302 });
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

