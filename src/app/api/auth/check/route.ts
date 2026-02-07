import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const envKeys = Object.keys(process.env);

    return NextResponse.json({
        message: 'Environment Diagnostics',
        totalKeys: envKeys.length,
        webAdminLoginFound: !!process.env.WEB_ADMIN_LOGIN,
        webAdminPassFound: !!process.env.WEB_ADMIN_PASSWORD,
        adminUserLegacyFound: !!process.env.ADMIN_USER,
        allPrefixesFound: envKeys.filter(k =>
            k.startsWith('WEB_') ||
            k.startsWith('ADMIN_') ||
            k.startsWith('SUPABASE_') ||
            k.startsWith('GREEN_API_') ||
            k.startsWith('GEMINI_')
        )
    });
}
