import { NextResponse } from 'next/server';
import { convex } from '@/lib/convex';
import { api } from '@/convex/_generated/api';

export async function GET() {
    try {
        // We'll reuse searchUsers with empty query to get all (limited to 10 for showcase)
        const users = await convex.query(api.users.searchUsers, { query: "" });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
