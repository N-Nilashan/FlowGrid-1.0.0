import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';

export async function DELETE() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Get user's calendar tokens
    const { data: tokens } = await supabase
      .from('user_calendar_tokens')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    // Revoke Google Calendar access if connected
    if (tokens) {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });

      try {
        await oauth2Client.revokeToken(tokens.access_token);
      } catch (error) {
        console.error('Error revoking Google token:', error);
      }
    }

    // Delete all user data in transaction
    const { error } = await supabase.rpc('delete_user_data', {
      user_id: session.user.id
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
