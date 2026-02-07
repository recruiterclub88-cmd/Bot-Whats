import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const envKeys = Object.keys(process.env);
    const adminUserExists = !!process.env.ADMIN_USER;
    const adminPassExists = !!process.env.ADMIN_PASS;

    return NextResponse.json({
        message: 'Environment Check',
        adminUserExists,
        adminPassExists,
        keysFound: envKeys.filter(k => k.startsWith('ADMIN_') || k.startsWith('SUPABASE_') || k.startsWith('GREEN_API_') || k.startsWith('GEMINI_'))
    });
}
