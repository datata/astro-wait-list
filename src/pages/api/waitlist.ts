export const prerender = false;
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    const bodyText = await request.text();

    if (!bodyText) {
        return new Response(JSON.stringify({ error: 'Body vacío' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const data = JSON.parse(bodyText);
    const email = data.email;

    const hasValidEmail = !email || typeof email !== 'string'  || !isValidEmail(email)

    if (hasValidEmail) {
        return new Response(
            JSON.stringify({ error: 'Email inválido' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
        JSON.stringify({ data: email }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
};


function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
