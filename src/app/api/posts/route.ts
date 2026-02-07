/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { convex } from '@/lib/convex';
import { api } from '../../../../convex/_generated/api';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function extractHashtags(text: string): string[] {
  const regex = /#[\w]+/g;
  const matches = text.match(regex) || [];
  return matches.map((tag) => tag.toLowerCase());
}

export async function GET() {
  try {
    const posts = await convex.query(api.posts.getPosts);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    // Verify token to get user ID
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { content, image } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Post content is required' }, { status: 400 });
    }

    const hashtags = extractHashtags(content);

    // Create post using Convex mutation
    const newPost = await convex.mutation(api.posts.createPost, {
      userId: decoded.userId as any, // Cast to any because it's a string, and Convex checks ID format at runtime or via types if generated.
      content,
      image,
      hashtags,
    });

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create post' },
      { status: 500 }
    );
  }
}
