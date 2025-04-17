import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Get user's tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('user_calendar_tokens')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (tokenError || !tokens) {
      return NextResponse.json({ error: 'Calendar not connected' }, { status: 404 });
    }

    // Initialize OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/calendar/callback`
    );

    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date
    });

    // Create Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

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

    // Transform events to match FullCalendar format
    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      allDay: !event.start.dateTime,
      description: event.description,
      location: event.location,
      backgroundColor: '#7C3AED', // Purple color
      borderColor: '#6D28D9',
      textColor: '#ffffff'
    }));

    // If token was refreshed, update it in the database
    const tokens_updated = oauth2Client.credentials;
    if (tokens_updated.access_token !== tokens.access_token) {
      await supabase
        .from('user_calendar_tokens')
        .update({
          access_token: tokens_updated.access_token,
          expiry_date: tokens_updated.expiry_date,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id);
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);

    // Check if error is due to invalid token
    if (error.code === 401) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}
