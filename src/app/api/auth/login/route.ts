import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Спробуємо дістати змінні всіма можливими способами
        const adminUser = process.env.MY_ADMIN_USER || process.env['MY_ADMIN_USER'];
        const adminPass = process.env.MY_ADMIN_PASS || process.env['MY_ADMIN_PASS'];

        if (!adminUser || !adminPass) {
            return NextResponse.json({
                error: 'SERVER_CONFIG_ERROR',
                details: `Missing: ${!adminUser ? 'USER' : ''} ${!adminPass ? 'PASS' : ''}`.trim()
            }, { status: 500 });
        }

        if (username === adminUser && password === adminPass) {
            const response = NextResponse.json({ success: true });
            const token = btoa(`${username}:${password}`);

            response.cookies.set('admin_session', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24
            });

            return response;
        }

        return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
    }
}
