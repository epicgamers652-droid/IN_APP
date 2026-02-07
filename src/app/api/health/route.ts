/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Convex connection...');
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
    console.log('CONVEX_URL:', convexUrl?.substring(0, 30) + '...');

    if (!convexUrl) {
      throw new Error("CONVEX_URL environment variable is missing");
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Convex client configured',
      database: 'convex',
    });
  } catch (error: any) {
    console.error('❌ Health check failed:', error.message);

    return NextResponse.json({
      status: 'error',
      message: error.message,
      hint: 'Check CONVEX_URL environment variable',
      database: 'disconnected',
    }, { status: 503 });
  }
}
