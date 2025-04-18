import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { cookies } from 'next/headers';

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

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Verify state matches user email
  if (state !== session.user.email) {
    return new Response('Invalid state', { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens securely in cookies with longer expiration
    const cookieStore = cookies();
    await cookieStore.set('calendar_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    if (tokens.refresh_token) {
      await cookieStore.set('calendar_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 365 * 24 * 60 * 60 // 1 year
      });
    }

    // Redirect back to the calendar page
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/flow?tab=Google Calendar&connected=true'
      }
    });
  } catch (error) {
    console.error('Error getting tokens:', error);
    return new Response('Error getting tokens', { status: 500 });
  }
}
