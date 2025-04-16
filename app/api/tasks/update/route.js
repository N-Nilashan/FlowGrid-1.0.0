import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Create a Supabase client with the service role key for server-side operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { taskId, completed, category } = await req.json();

    if (!taskId) {
      return new Response(JSON.stringify({ error: 'Task ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify task belongs to user
    const { data: task, error: fetchError } = await supabaseAdmin
      .from('tasks')
      .select('user_id')
      .eq('id', taskId)
      .single();

    if (fetchError || !task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (task.user_id !== session.user.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare update data
    const updateData = {};
    if (completed !== undefined) updateData.completed = completed;
    if (category !== undefined) updateData.category = category;

    // Update task
    const { error: updateError } = await supabaseAdmin
      .from('tasks')
      .update(updateData)
      .eq('id', taskId);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
