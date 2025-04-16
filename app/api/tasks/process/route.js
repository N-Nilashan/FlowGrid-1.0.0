import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { google } from 'googleapis';

// Create a Supabase client with the service role key for server-side operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(req) {
  try {
    console.log('Fetching session...');
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.log('No valid session found:', session);
      return new Response(JSON.stringify({ error: 'Unauthorized - Please sign in' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Session found for user:', session.user.email);

    // Initialize Google Calendar API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
    );

    if (!session.accessToken) {
      console.log('No access token found in session');
      return new Response(JSON.stringify({ error: 'No Google Calendar access token - Please reconnect your Google account' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    oauth2Client.setCredentials({
      access_token: session.accessToken
    });

    console.log('Fetching calendar events...');
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Fetch calendar events
    const now = new Date();
    // Set to start of today (12 AM)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Set to end of next 7 days (11:59:59.999 PM)
    const endOfWeek = new Date(startOfToday);
    endOfWeek.setDate(startOfToday.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log('Date range:', {
      start: startOfToday.toISOString(),
      end: endOfWeek.toISOString()
    });

    // First, get existing tasks to preserve completion status
    const { data: existingTasks, error: existingTasksError } = await supabaseAdmin
      .from('tasks')
      .select('id, completed')
      .eq('user_id', session.user.email);

    if (existingTasksError) {
      console.error('Error fetching existing tasks:', existingTasksError);
      throw new Error('Failed to fetch existing tasks');
    }

    // Create a map of existing task completion status
    const existingTasksMap = new Map(
      existingTasks.map(task => [task.id, task.completed])
    );

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfToday.toISOString(),
      timeMax: endOfWeek.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    }).catch(error => {
      console.error('Google Calendar API error:', error);
      throw new Error('Failed to fetch calendar events: ' + error.message);
    });

    const events = response.data.items || [];
    console.log(`Found ${events.length} calendar events`);

    // Process events into tasks
    const tasks = events.map(event => {
      // Ensure timestamps are valid
      const startTime = event.start?.dateTime || event.start?.date || startOfToday.toISOString();
      const endTime = event.end?.dateTime || event.end?.date || startOfToday.toISOString();

      return {
        id: event.id || crypto.randomUUID(),
        title: event.summary || 'Untitled Event',
        start: new Date(startTime).toISOString(),
        end: new Date(endTime).toISOString(),
        description: event.description || null,
        priority: determinePriority(event),
        category: determineCategory(event),
        user_id: session.user.email,
        // Preserve completion status if task exists, otherwise set to false
        completed: existingTasksMap.has(event.id) ? existingTasksMap.get(event.id) : false,
        created_at: new Date().toISOString()
      };
    });

    console.log(`Processing ${tasks.length} tasks...`);

    // Store tasks in Supabase using admin client
    if (tasks.length > 0) {
      console.log('Upserting tasks to Supabase...');
      const { error: upsertError } = await supabaseAdmin
        .from('tasks')
        .upsert(tasks, {
          onConflict: 'id',
          ignoreDuplicates: false
        });

      if (upsertError) {
        console.error('Supabase upsert error:', upsertError);
        throw new Error('Failed to store tasks: ' + upsertError.message);
      }
    }

    // Get the view mode from query parameter (default to 'today')
    const searchParams = new URL(req.url).searchParams;
    const viewMode = searchParams.get('view') || 'today';

    // Fetch all tasks for the user using admin client
    console.log('Fetching user tasks from Supabase...');
    console.log('View mode:', viewMode);

    let query = supabaseAdmin
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.email)
      .gte('start', startOfToday.toISOString());

    // Add end date filter based on view mode
    if (viewMode === 'today') {
      const endOfToday = new Date(startOfToday);
      endOfToday.setHours(23, 59, 59, 999);
      query = query.lte('start', endOfToday.toISOString());
    } else {
      query = query.lte('start', endOfWeek.toISOString());
    }

    const { data: userTasks, error: fetchError } = await query.order('start', { ascending: true });

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      throw new Error('Failed to fetch tasks: ' + fetchError.message);
    }

    // Group tasks by category
    const groupedTasks = {
      studies: (userTasks || []).filter(task => task.category === 'studies'),
      personal: (userTasks || []).filter(task => task.category === 'personal'),
    };

    console.log('Successfully processed tasks:', {
      studies: groupedTasks.studies.length,
      personal: groupedTasks.personal.length,
      viewMode: viewMode
    });

    return new Response(JSON.stringify(groupedTasks), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return new Response(JSON.stringify({
      error: error.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function determinePriority(event) {
  const title = (event.summary || '').toLowerCase();
  const description = (event.description || '').toLowerCase();

  // Keywords that might indicate high priority
  const highPriorityKeywords = ['urgent', 'important', 'exam', 'deadline', 'due'];
  // Keywords that might indicate medium priority
  const mediumPriorityKeywords = ['assignment', 'meeting', 'review', 'project'];

  if (highPriorityKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
    return 'high';
  }

  if (mediumPriorityKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
    return 'medium';
  }

  return 'low';
}

function determineCategory(event) {
  const title = (event.summary || '').toLowerCase();
  const description = (event.description || '').toLowerCase();

  // Keywords that might indicate study-related events
  const studyKeywords = ['class', 'lecture', 'physics', 'chemistry', 'maths', 'combined maths', 'study', 'exam', 'assignment', 'homework', 'course'];

  if (studyKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
    return 'studies';
  }

  return 'personal';
}
