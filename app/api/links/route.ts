import { NextRequest, NextResponse } from 'next/server';
import { getPool, initDatabase } from '@/lib/db';
import { generateCode, validateCode, validateUrl } from '@/lib/utils';

// Initialize database on first import
let dbInitialized = false;
async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// POST /api/links - Create a new link
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const body = await request.json();
    const { url, code: customCode } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!validateUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const pool = getPool();
    let code = customCode;

    if (code) {
      if (!validateCode(code)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }

      // Check if code already exists
      const existing = await pool.query(
        'SELECT id FROM links WHERE code = $1',
        [code]
      );

      if (existing.rows.length > 0) {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }
    } else {
      // Generate unique code
      let attempts = 0;
      do {
        code = generateCode(6);
        const existing = await pool.query(
          'SELECT id FROM links WHERE code = $1',
          [code]
        );
        if (existing.rows.length === 0) break;
        attempts++;
        if (attempts > 10) {
          code = generateCode(8);
          break;
        }
      } while (true);
    }

    const result = await pool.query(
      'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING *',
      [code, url]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating link:', error);
    if (error.code === '23505') {
      // Unique constraint violation
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/links - List all links
export async function GET() {
  try {
    await ensureDbInitialized();
    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM links ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

