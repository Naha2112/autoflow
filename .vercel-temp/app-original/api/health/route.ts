import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test prisma connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({
      status: 'ok',
      message: 'System is healthy',
      database: 'connected',
      test: result
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