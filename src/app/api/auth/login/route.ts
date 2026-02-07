import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        const adminUser = process.env.ADMIN_USER;
        const adminPass = process.env.ADMIN_PASS;

        if (!adminUser || !adminPass) {
            console.error('[Login API] ADMIN_USER or ADMIN_PASS not configured in environment');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        if (username === adminUser && password === adminPass) {
            const response = NextResponse.json({ success: true });

            // Set a simple auth cookie. In a real app, this would be a signed JWT/Session ID.
            // For this project, we'll use a simple "logged_in" marker + credentials in a cookie (encrypted or just plain for now as it's a private bot).
            // Let's use a base64 of user:pass as a simple token.
            const token = btoa(`${username}:${password}`);

            response.cookies.set('admin_session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 // 24 hours
            });

            return response;
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
