import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Update - Session data:', session);

    if (!session?.user?.email) {
      console.log('Update - No session or email found');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    console.log('Update - Request body:', body);

    // Check if the record exists first
    const { data: existingData, error: checkError } = await supabaseAdmin
      .from('gamification')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Update - Error checking existing record:', checkError);
      throw checkError;
    }

    const currentTime = new Date().toISOString();
    const gameData = {
      streak: body.streak,
      last_completed_date: body.lastCompletedDate,
      experience: body.experience,
      level: body.level,
      achievements: body.achievements,
      updated_at: currentTime
    };

    let result;
    if (!existingData) {
      // Insert new record
      console.log('Update - Creating new record for:', session.user.email);
      result = await supabaseAdmin
        .from('gamification')
        .insert({
          ...gameData,
          email: session.user.email,
          created_at: currentTime
        });
    } else {
      // Update existing record
      console.log('Update - Updating existing record for:', session.user.email);
      result = await supabaseAdmin
        .from('gamification')
        .update(gameData)
        .eq('email', session.user.email);
    }

    if (result.error) {
      console.error('Update - Supabase error:', {
        error: result.error,
        email: session.user.email,
        body
      });
      throw result.error;
    }

    console.log('Update - Successfully updated gamification data');
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update - Error in route:', {
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
