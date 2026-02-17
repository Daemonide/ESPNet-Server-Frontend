import { NextResponse } from 'next/server';

// Check if we're in development or production
const isDevelopment = process.env.NODE_ENV === 'development';
const API_URL = process.env.SERVER_API_URL || 'http://localhost:8080';

export async function GET() {
  try {
    console.log(`Fetching devices from: ${API_URL}/api/devices`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_URL}/api/devices`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server');
    }

    // Ensure we have proper defaults
    const validatedData = {
      devices: Array.isArray(data.devices) ? data.devices : [],
      game: data.game || {
        teams: {},
        tagged_out: {},
        winners: undefined,
      },
    };

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error('Error fetching devices:', error);
    
    // Return empty but valid response structure
    return NextResponse.json({
      devices: [],
      game: {
        teams: {},
        tagged_out: {},
        winners: undefined,
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    const { mac, action } = await request.json();
    
    if (!mac || !action) {
      return NextResponse.json(
        { error: 'Missing mac or action' },
        { status: 400 }
      );
    }
    
    let endpoint = '';
    switch (action) {
      case 'restart':
        endpoint = `/api/restart/${mac}`;
        break;
      case 'reset_wifi':
        endpoint = `/api/reset_wifi/${mac}`;
        break;
      case 'delete':
        endpoint = `/api/remove/${mac}`;
        break;
      case 'tag':
        endpoint = `/api/tag/${mac}`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error performing action:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}