import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = [
      'https://www.googleapis.com/auth/calendar',        // Full calendar access
      'https://www.googleapis.com/auth/calendar.events', // Full event access
      'https://www.googleapis.com/auth/userinfo.profile' // Basic profile info
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',      // Get refresh token
      scope: scopes,
      prompt: 'consent',           // Force consent screen
      include_granted_scopes: true // Include previously granted scopes
    });

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to initialize Google Calendar connection' },
      { status: 500 }
    );
  }
}
