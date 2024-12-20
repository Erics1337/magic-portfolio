
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const { password } = await request.json();
    const correctPassword = 'password';

    if (password === correctPassword) {
        cookies().set('authToken', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            sameSite: 'strict',
            path: '/',
        });

        return Response.json({ success: true });
    } else {
        return Response.json({ message: 'Incorrect password' }, { status: 401 });
    }
}
