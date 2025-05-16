import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Simple DB check that doesn't require any specific schema
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    
    return NextResponse.json({
      status: 'ok',
      message: 'API is healthy',
      prisma: {
        status: 'connected', 
        result
      }
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'API health check failed',
      error: error.message
    }, { status: 500 });
  }
} 