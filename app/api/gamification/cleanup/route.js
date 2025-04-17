import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // 1. Delete all records for this user
    const { error: deleteError } = await supabaseAdmin
      .from('gamification')
      .delete()
      .eq('email', session.user.email);

    if (deleteError) {
      throw deleteError;
    }

    // 2. Create a fresh record
    const defaultData = {
      email: session.user.email,
      streak: 0,
      last_completed_date: null,
      experience: 0,
      level: 1,
      achievements: [
        { id: 'first_task', title: 'First Steps', description: 'Complete your first task', completed: false, icon: '🎯' },
        { id: 'five_tasks', title: 'Getting Things Done', description: 'Complete 5 tasks', completed: false, icon: '🏆' },
        { id: 'category_master', title: 'Category Master', description: 'Complete tasks in all categories', completed: false, icon: '🌈' },
        { id: 'streak_3', title: 'On a Roll', description: 'Maintain a 3-day streak', completed: false, icon: '🔥' },
        { id: 'perfect_day', title: 'Perfect Day', description: 'Complete all tasks for a day', completed: false, icon: '⭐' },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await supabaseAdmin
      .from('gamification')
      .insert([defaultData]);

    if (insertError) {
      throw insertError;
    }

    return new Response(JSON.stringify({ success: true, message: 'Database cleaned and reset' }));
  } catch (error) {
    console.error('Cleanup error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
