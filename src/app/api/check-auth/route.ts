
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const authToken = cookies().get('authToken');

    if (authToken?.value === 'authenticated') {
        return Response.json({ authenticated: true });
    } else {
        return Response.json({ authenticated: false }, { status: 401 });
    }
}
