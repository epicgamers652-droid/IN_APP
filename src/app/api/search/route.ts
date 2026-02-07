/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { convex } from '@/lib/convex';
import { api } from '../../../../convex/_generated/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, users, posts, hashtags

    const results: { users?: any[]; posts?: any[]; hashtags?: any[] } = {};

    if (type === 'all' || type === 'users') {
      results.users = await convex.query(api.users.searchUsers, { query });
    }

    if (type === 'all' || type === 'posts') {
      results.posts = await convex.query(api.posts.searchPosts, { query });
    }

    if (type === 'all' || type === 'hashtags') {
      results.hashtags = await convex.query(api.hashtags.searchHashtags, { query });
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
