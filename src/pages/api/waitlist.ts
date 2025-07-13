export const prerender = false;
import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../config/db/mongo';

export const POST: APIRoute = async ({ request }) => {
    try {
        const bodyText = await request.text();

        if (!bodyText) {
            return new Response(JSON.stringify({ error: 'Body vacío' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        const data = JSON.parse(bodyText);
        const email = data.email;

        const hasValidEmail = !email || typeof email !== 'string' || !isValidEmail(email)

        if (hasValidEmail) {
            return new Response(
                JSON.stringify({ error: 'Email inválido' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const db = await connectToDatabase();
        const collection = db.collection('emails');

        const existing = await collection.findOne({ to: email });

        if (existing) {
          return new Response(
            JSON.stringify({ error: 'Email registered' }),
            { status: 409 }
          );
        }

        const newEmail = {
            to: email,
            status: 'pending',
            createdAt: new Date(),
            retryCount: 0,
            lastTriedAt: null,
            error: null,
            sentAt: null,
        };

        await collection.insertOne(newEmail);

        return new Response(
            JSON.stringify({ data: email }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
};


function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
