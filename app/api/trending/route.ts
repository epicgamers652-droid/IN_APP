import { NextResponse } from 'next/server';
import { convex } from '@/lib/convex';
import { api } from '@/convex/_generated/api';

export async function GET() {
  try {
    const trending = await convex.query(api.hashtags.getTrending);
    return NextResponse.json(trending);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch trending hashtags' },
      { status: 500 }
    );
  }
}
