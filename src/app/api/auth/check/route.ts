import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        check: 'v3',
        MY_ADMIN_USER: !!process.env.MY_ADMIN_USER,
        MY_ADMIN_PASS: !!process.env.MY_ADMIN_PASS,
        WEB_ADMIN_LOGIN: !!process.env.WEB_ADMIN_LOGIN,
        ADMIN_USER: !!process.env.ADMIN_USER,
        all_keys: Object.keys(process.env).filter(k => k.includes('ADMIN') || k.includes('API') || k.includes('SUPA'))
    });
}
