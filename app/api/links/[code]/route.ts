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

// GET /api/links/:code - Get stats for a specific link
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await ensureDbInitialized();
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM links WHERE code = $1',
      [params.code]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/links/:code - Delete a link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    await ensureDbInitialized();
    const pool = getPool();
    const result = await pool.query(
      'DELETE FROM links WHERE code = $1 RETURNING *',
      [params.code]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

