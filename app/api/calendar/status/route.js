import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ connected: false }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Check if user has valid Google Calendar tokens
    const { data: tokens } = await supabase
      .from('user_calendar_tokens')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    return NextResponse.json({ connected: !!tokens });
  } catch (error) {
    console.error('Error checking calendar status:', error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}
