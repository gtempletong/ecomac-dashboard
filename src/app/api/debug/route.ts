import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const debugInfo = {
      environment: process.env.NODE_ENV,
      hasCredentialsEnv: !!process.env.GOOGLE_CREDENTIALS_JSON,
      credentialsLength: process.env.GOOGLE_CREDENTIALS_JSON?.length || 0,
      credentialsStart: process.env.GOOGLE_CREDENTIALS_JSON?.substring(0, 50) || 'undefined',
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version
    };

    console.log('Debug info:', debugInfo);
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Debug failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
