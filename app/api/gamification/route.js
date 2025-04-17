import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create a Supabase client with the service role key for server-side operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session data:', session); // Log session data

    if (!session?.user?.email) {
      console.log('No session or email found');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch gamification data for the user
    const { data, error } = await supabaseAdmin
      .from('gamification')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (error) {
      console.error('Error fetching gamification data:', {
        error,
        email: session.user.email
      });
      throw error;
    }

    // If no data exists yet, insert default values
    if (!data) {
      console.log('No existing data, creating default data');
      const defaultData = {
        streak: 0,
        lastCompletedDate: null,
        experience: 0,
        level: 1,
        achievements: [
          { id: 'first_task', title: 'First Steps', description: 'Complete your first task', completed: false, icon: '🎯' },
          { id: 'five_tasks', title: 'Getting Things Done', description: 'Complete 5 tasks', completed: false, icon: '🏆' },
          { id: 'category_master', title: 'Category Master', description: 'Complete tasks in all categories', completed: false, icon: '🌈' },
          { id: 'streak_3', title: 'On a Roll', description: 'Maintain a 3-day streak', completed: false, icon: '🔥' },
          { id: 'perfect_day', title: 'Perfect Day', description: 'Complete all tasks for a day', completed: false, icon: '⭐' },
        ]
      };

      // Insert default data
      const { error: insertError } = await supabaseAdmin
        .from('gamification')
        .insert({
          email: session.user.email,
          streak: defaultData.streak,
          last_completed_date: defaultData.lastCompletedDate,
          experience: defaultData.experience,
          level: defaultData.level,
          achievements: defaultData.achievements,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error inserting default data:', {
          error: insertError,
          defaultData,
          email: session.user.email
        });
        throw insertError;
      }

      return new Response(JSON.stringify(defaultData), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Found existing data:', data); // Log found data

    // Transform the data to match the expected format
    const transformedData = {
      streak: data.streak,
      lastCompletedDate: data.last_completed_date,
      experience: data.experience,
      level: data.level,
      achievements: data.achievements
    };

    return new Response(JSON.stringify(transformedData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gamification GET route:', {
      error,
      stack: error.stack
    });
    return new Response(JSON.stringify({
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
