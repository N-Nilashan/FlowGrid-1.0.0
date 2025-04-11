import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
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

  const cookieStore = cookies();
  const accessToken = cookieStore.get('calendar_access_token');
  const refreshToken = cookieStore.get('calendar_refresh_token');

  if (!accessToken) {
    return new Response('No access token', { status: 401 });
  }

  oauth2Client.setCredentials({
    access_token: accessToken.value,
    refresh_token: refreshToken?.value,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    // Get events for the next 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: thirtyDaysFromNow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      description: event.description,
      color: '#7C3AED', // Using our theme color
    }));

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response('Error fetching events', { status: 500 });
  }
}
