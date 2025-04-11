import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { cookies } from 'next/headers';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/calendar/callback`
);

// Helper function to determine priority based on event details
function determinePriority(event) {
  const title = event.summary?.toLowerCase() || '';
  const description = event.description?.toLowerCase() || '';
  const combinedText = `${title} ${description}`;

  // High priority keywords
  if (combinedText.match(/exam|test|final|deadline|due|important|urgent/)) {
    return 'high';
  }
  // Medium priority keywords
  if (combinedText.match(/class|lecture|study|meeting|assignment|project/)) {
    return 'medium';
  }
  // Default to low priority
  return 'low';
}

// Helper function to categorize events
function categorizeEvent(event) {
  const title = event.summary?.toLowerCase() || '';
  const description = event.description?.toLowerCase() || '';
  const combinedText = `${title} ${description}`;

  // Academic/Study related keywords
  const studyKeywords = [
    'class', 'lecture', 'exam', 'test', 'study', 'assignment',
    'project', 'homework', 'research', 'seminar', 'workshop',
    'tutorial', 'lab', 'presentation', 'paper', 'quiz','physics','chemistry','maths'
  ];

  // Check if any study keywords are present
  const isStudyRelated = studyKeywords.some(keyword =>
    combinedText.includes(keyword)
  );

  return isStudyRelated ? 'studies' : 'personal';
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Get calendar events
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

    const events = response.data.items;

    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ studies: [], personal: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process and categorize events
    const categorizedEvents = {
      studies: [],
      personal: []
    };

    events.forEach(event => {
      const category = categorizeEvent(event);
      const priority = determinePriority(event);

      const processedEvent = {
        id: event.id,
        title: event.summary || 'Untitled Event',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description || '',
        priority: priority,
        completed: false
      };

      categorizedEvents[category].push(processedEvent);
    });

    return new Response(JSON.stringify(categorizedEvents), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing tasks:', error);
    return new Response(error.message || 'Error processing tasks', { status: 500 });
  }
}
