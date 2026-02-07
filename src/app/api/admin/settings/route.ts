import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!process.env.SUPABASE_URL) {
      throw new Error('DEBUG: SUPABASE_URL is missing in environment variables.');
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('DEBUG: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables.');
    }

    // Отримуємо клієнт заново, щоб переконатися, що він ініціалізований з актуальними змінними
    const { getSupabaseAdmin } = require('@/lib/server/db');
    const db = getSupabaseAdmin();

    if (!db) throw new Error('DEBUG: Failed to initialize Supabase client (db is null).');

    const { data, error } = await db


      .from('settings')
      .select('key,value')
      .in('key', ['system_prompt', 'site_url', 'candidate_link', 'agency_link', 'tone']);

    if (error) throw new Error(error.message);

    const map: Record<string, string> = {};
    for (const row of data || []) map[row.key] = row.value;

    return NextResponse.json({
      system_prompt: map.system_prompt || '',
      site_url: map.site_url || '',
      candidate_link: map.candidate_link || '',
      agency_link: map.agency_link || '',
      tone: map.tone || '',
    });
  } catch (e: any) {
    console.error('[Settings API GET] Error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const upserts = [
      ['system_prompt', String(body.system_prompt || '')],
      ['site_url', String(body.site_url || '')],
      ['candidate_link', String(body.candidate_link || '')],
      ['agency_link', String(body.agency_link || '')],
      ['tone', String(body.tone || '')],
    ].map(([key, value]) => ({ key, value }));

    const { error } = await supabaseAdmin.from('settings').upsert(upserts, { onConflict: 'key' });
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[Settings API POST] Error:', e);
    return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
  }
}
