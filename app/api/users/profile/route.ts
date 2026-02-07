import { NextRequest, NextResponse } from 'next/server';
import { convex } from '@/lib/convex';
import { api } from '@/convex/_generated/api';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function PUT(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.slice(7);
        let decoded: { userId: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        } catch (e) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { username, bio, website, pronouns, isPrivate, avatar } = body;

        await convex.mutation(api.users.updateUser, {
            userId: decoded.userId as any,
            username,
            bio,
            website,
            pronouns,
            isPrivate,
            avatar,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update profile' },
            { status: 500 }
        );
    }
}
