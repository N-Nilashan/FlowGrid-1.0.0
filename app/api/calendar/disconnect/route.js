import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the Google Calendar tokens from cookies
    const cookieStore = cookies();
    cookieStore.delete('google_access_token');
    cookieStore.delete('google_refresh_token');
    cookieStore.delete('calendar_connected');

    return NextResponse.json({ message: 'Calendar disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect calendar' },
      { status: 500 }
    );
  }
}
