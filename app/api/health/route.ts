import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    // Test prisma connection
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'ok',
      message: 'System is healthy',
      database: 'connected',
      users: userCount
    }, { status: 200 });
  } catch (error: any) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'System health check failed',
      error: error.message
    }, { status: 500 });
  }
} 