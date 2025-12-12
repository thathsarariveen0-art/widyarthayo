import { NextResponse } from 'next/server'

// Health check and info endpoint
export async function GET(request) {
  return NextResponse.json({
    message: 'විද්‍යාර්ථයෝ API is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}

export async function POST(request) {
  return NextResponse.json({
    message: 'POST endpoint',
    status: 'ok'
  })
}
