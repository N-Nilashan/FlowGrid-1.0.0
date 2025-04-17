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
  const accessToken = cookieStore.get('calendar_access_token')?.value;
  const refreshToken = cookieStore.get('calendar_refresh_token')?.value;

  if (!accessToken) {
    return new Response('No access token', { status: 401 });
  }

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    // First, get the calendar list to get calendar-specific colors
    const calendarList = await calendar.calendarList.list();
    const calendars = new Map(
      calendarList.data.items.map(cal => [cal.id, {
        backgroundColor: cal.backgroundColor,
        foregroundColor: cal.foregroundColor
      }])
    );

    // Get the color definitions from Google Calendar
    const { data: { event: eventColors } } = await calendar.colors.get();

    // Get events starting from current date's 12 am
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of day
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: thirtyDaysFromNow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items.map(event => {
      let backgroundColor;
      let textColor = '#FFFFFF';

      // First try to get event-specific color
      if (event.colorId && eventColors[event.colorId]) {
        backgroundColor = eventColors[event.colorId].background;
        textColor = eventColors[event.colorId].foreground;
      }
      // Then try to get color from the calendar
      else if (event.organizer?.email && calendars.has(event.organizer.email)) {
        const calendarColors = calendars.get(event.organizer.email);
        backgroundColor = calendarColors.backgroundColor;
        textColor = calendarColors.foregroundColor;
      }
      // Finally fallback to default purple
      else {
        backgroundColor = '#7C3AED';
        textColor = '#FFFFFF';
      }

      return {
        id: event.id,
        title: event.summary || 'Untitled Event',
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: event.description,
        backgroundColor,
        textColor,
        borderColor: backgroundColor,
        // Add additional event properties
        allDay: !event.start?.dateTime,
        location: event.location,
        calendarId: event.organizer?.email
      };
    });

    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return new Response('Error fetching events', { status: 500 });
  }
}
