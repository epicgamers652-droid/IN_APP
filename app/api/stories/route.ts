import { NextResponse } from 'next/server';
import { convex } from '@/lib/convex';
import { api } from '@/convex/_generated/api';

export async function GET() {
    try {
        const stories = await convex.query(api.stories.getStories);
        return NextResponse.json(stories);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch stories' },
            { status: 500 }
        );
    }
}
