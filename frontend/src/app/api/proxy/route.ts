import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://artmind.us-east-2.elasticbeanstalk.com';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    const contentType = request.headers.get('content-type');
    let body;

    if (contentType?.includes('multipart/form-data')) {
      body = await request.formData();
    } else if (contentType?.includes('application/json')) {
      body = await request.json();
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: contentType?.includes('application/json') 
        ? { 'Content-Type': 'application/json' }
        : {},
      signal: AbortSignal.timeout(300000), // 5 minutos timeout para generación de imágenes
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_URL}${path}`);
    
    if (path.includes('/uploads/') || path.includes('/generated/')) {
      const blob = await response.blob();
      return new NextResponse(blob, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/png',
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}
