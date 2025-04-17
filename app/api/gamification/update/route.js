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

    if (checkError) {
      console.error('Update - Error checking existing record:', checkError);
      throw checkError;
    }

    if (!existingData) {
      console.error('Update - No existing record found for email:', session.user.email);
      return new Response(JSON.stringify({ error: 'No gamification record found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update gamification data
    const { error } = await supabaseAdmin
      .from('gamification')
      .update({
        streak: body.streak,
        last_completed_date: body.lastCompletedDate,
        experience: body.experience,
        level: body.level,
        achievements: body.achievements,
        updated_at: new Date().toISOString()
      })
      .eq('email', session.user.email);

    if (error) {
      console.error('Update - Supabase error:', {
        error,
        email: session.user.email,
        body
      });
      throw error;
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
