import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';

// Initialize Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/calendar/callback`
);

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Generate auth URL
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events.readonly'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: session.user.email // We'll use this to verify the user in callback
  });

  return new Response(JSON.stringify({ url: authUrl }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
