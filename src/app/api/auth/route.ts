/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { convex } from '@/lib/convex';
import { api } from '../../../../convex/_generated/api';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { username, password, isSignUp } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (isSignUp) {
      const existingUser = await convex.query(api.users.getUserByUsername, { username });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await convex.mutation(api.users.createUser, {
        username,
        email: `${username}@in.local`,
        password: hashedPassword,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 100)}`,
      });

      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

      return NextResponse.json({
        user: {
          _id: newUser._id,
          id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          avatar: newUser.avatar,
          bio: newUser.bio || '',
          followers: newUser.followers || [],
          following: newUser.following || [],
          createdAt: newUser.createdAt,
        },
        token,
      });
    } else {
      // Login logic
      const user = await convex.query(api.users.getUserByUsername, { username });
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        );
      }

      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      return NextResponse.json({
        user: {
          _id: user._id,
          id: user._id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio || '',
          followers: user.followers || [],
          following: user.following || [],
          // Handling optional fields
          isPrivate: user.isPrivate,
          blockedUsers: user.blockedUsers,
          followRequests: user.followRequests,
          postsCount: user.postsCount,
          createdAt: user.createdAt,
        },
        token,
      });
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 500 }
    );
  }
}
