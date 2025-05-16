import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Simple operation that should work regardless of schema
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({
      status: 'ok',
      message: 'Prisma connection successful',
      result
    });
  } catch (error: any) {
    console.error('Prisma test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Prisma connection failed',
      error: error.message
    }, { status: 500 });
  }
} 