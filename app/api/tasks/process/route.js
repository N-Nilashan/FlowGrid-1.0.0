import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

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
      `${process.env.NEXTAUTH_URL}/api/calendar/callback`
    );

    // Get access token from cookies instead of session
    const cookieStore = cookies();
    const accessToken = cookieStore.get('calendar_access_token');
    const refreshToken = cookieStore.get('calendar_refresh_token');

    if (!accessToken) {
      console.log('No access token found in cookies');
      return new Response(JSON.stringify({ error: 'No Google Calendar access token - Please connect your Google Calendar' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Set credentials using cookie tokens
    oauth2Client.setCredentials({
      access_token: accessToken.value,
      refresh_token: refreshToken?.value,
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
      work: (userTasks || []).filter(task => task.category === 'work'),
      health: (userTasks || []).filter(task => task.category === 'health'),
      personal: (userTasks || []).filter(task => task.category === 'personal'),
      uncategorized: (userTasks || []).filter(task => task.category === 'uncategorized'),
    };

    console.log('Successfully processed tasks:', {
      studies: groupedTasks.studies.length,
      work: groupedTasks.work.length,
      health: groupedTasks.health.length,
      personal: groupedTasks.personal.length,
      uncategorized: groupedTasks.uncategorized.length,
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
  const startTime = new Date(event.start?.dateTime || event.start?.date);
  const endTime = new Date(event.end?.dateTime || event.end?.date);
  const eventDuration = (endTime - startTime) / (1000 * 60); // Duration in minutes
  const fullText = `${title} ${description}`;

  // Category definitions with keywords and patterns
  const categories = {
    studies: {
      keywords: [
        'class', 'lecture', 'physics', 'chemistry', 'maths', 'math', 'combined maths',
        'study', 'exam', 'assignment', 'homework', 'course', 'quiz', 'test', 'midterm',
        'final', 'project', 'paper', 'thesis', 'dissertation', 'lab', 'laboratory',
        'seminar', 'tutorial', 'workshop', 'college', 'university', 'school', 'academy',
        'professor', 'teacher', 'instructor', 'tutor', 'student', 'classroom', 'library',
        'calculus', 'algebra', 'geometry', 'biology', 'science', 'literature', 'history',
        'geography', 'economics', 'statistics', 'programming', 'computer science', 'research'
      ],
      patterns: [
        /\b[A-Z]{2,4}\s?\d{3,4}\b/i  // Matches patterns like CS101, MATH 202
      ],
      // Study events often scheduled on weekdays during typical class hours
      timePatterns: [
        { days: [1, 2, 3, 4, 5], startHour: 8, endHour: 18 }
      ]
    },
    work: {
      // More specific work-related phrases that require explicit context
      strongKeywords: [
        'quarterly meeting', 'team meeting', 'staff meeting', 'board meeting',
        'client meeting', 'status update', 'performance review', 'deadline',
        'project review', 'business', 'office', 'work presentation',
        'sales call', 'hiring', 'interview candidates', 'budget review'
      ],
      // General work keywords that need additional context
      keywords: [
        'meeting', 'presentation', 'client', 'project', 'report', 'email',
        'conference', 'briefing', 'interview', 'work', 'job', 'office',
        'manager', 'boss', 'colleague', 'team', 'department', 'hr', 'review', 'planning',
        'strategy', 'analysis', 'product', 'service', 'customer', 'market', 'sales',
        'budget', 'finance', 'post', 'accounting', 'audit', 'compliance', 'training', 'workshop'
      ],
      // Work events typically during business hours
      timePatterns: [
        { days: [1, 2, 3, 4, 5], startHour: 9, endHour: 17 }
      ]
    },
    health: {
      keywords: [
        'doctor', 'dentist', 'therapy', 'medical', 'appointment', 'checkup', 'hospital',
        'clinic', 'physician', 'psychiatrist', 'psychologist', 'counselor', 'therapist',
        'wellness', 'health', 'fitness', 'gym', 'workout', 'exercise', 'training', 'yoga',
        'meditation', 'physical', 'mental', 'diet', 'nutrition', 'medication', 'treatment'
      ]
    },
    personal: {
      keywords: [
        'birthday', 'dinner', 'lunch', 'sleep', 'breakfast', 'brunch', 'coffee', 'date', 'party',
        'celebration', 'anniversary', 'wedding', 'funeral', 'shopping', 'errands', 'family',
        'friend', 'movie', 'concert', 'show', 'theatre', 'travel', 'trip', 'vacation',
        'holiday', 'visit', 'meet', 'catch up', 'hangout', 'drink', 'bar', 'restaurant',
        'club', 'game', 'match', 'play', 'sport', 'hobby', 'leisure', 'relax'
      ],
      // Personal events often during evenings and weekends
      timePatterns: [
        { days: [0, 6], allDay: true }, // Weekends
        { days: [1, 2, 3, 4, 5], startHour: 18, endHour: 23 } // Weekday evenings
      ]
    }
  };

  // Score each category
  const scores = {};
  for (const [category, criteria] of Object.entries(categories)) {
    let score = 0;

    // Check strong keywords for work category (exact matches)
    if (category === 'work' && criteria.strongKeywords) {
      for (const phrase of criteria.strongKeywords) {
        if (fullText.includes(phrase)) {
          score += 3; // Higher weight for strong matches
        }
      }
    }

    // Check if title looks like "talk to person" or "call with person" - likely personal
    if (category === 'personal') {
      if (/\b(talk|chat|speak|call|meet|discuss)\s+(to|with)\s+\w+\b/i.test(fullText)) {
        score += 1.5;
      }
    }

    // Check keywords
    for (const keyword of criteria.keywords || []) {
      // For work category, require more context than just a single keyword
      if (category === 'work') {
        // Simple words like "talk", "post", "meeting" need more context
        const simpleWorkTerms = ['talk', 'post', 'meeting', 'call', 'review'];
        if (simpleWorkTerms.includes(keyword) && fullText.split(' ').length < 4) {
          continue; // Skip this keyword if not enough context
        }

        // If title is just something like "talk to [name]", don't match work
        if (/^(talk|chat|speak|call|meet)\s+(to|with)\s+\w+$/i.test(title) && keyword !== 'meeting') {
          continue;
        }
      }

      if (fullText.includes(keyword)) {
        score += 1;
      }
    }

    // Check regex patterns
    for (const pattern of criteria.patterns || []) {
      if (pattern.test(fullText)) {
        score += 2; // Give more weight to pattern matches
      }
    }

    // Check time patterns
    if (criteria.timePatterns) {
      const dayOfWeek = startTime.getDay(); // 0 is Sunday
      const hour = startTime.getHours();

      for (const timePattern of criteria.timePatterns) {
        if (timePattern.days.includes(dayOfWeek)) {
          if (timePattern.allDay) {
            score += 0.5;
          } else if (hour >= timePattern.startHour && hour <= timePattern.endHour) {
            score += 0.5;
          }
        }
      }
    }

    // Special case for durations
    if (category === 'studies' && eventDuration > 60) {
      score += 0.5; // Longer events are more likely to be classes
    }
    if (category === 'work' && eventDuration >= 30 && eventDuration <= 60) {
      score += 0.5; // Work meetings are often 30-60 mins
    }

    scores[category] = score;
  }

  // Find the category with the highest score
  let topCategory = 'uncategorized'; // Default to uncategorized instead of personal
  let topScore = 0.5; // Set a threshold to require some confidence

  for (const [category, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topCategory = category;
    }
  }

  return topCategory;
}
