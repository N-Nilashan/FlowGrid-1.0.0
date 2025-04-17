import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.redirect('/');
    }

    // Get the code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      throw new Error('No authorization code received');
    }

    // Initialize OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Store tokens in database
    await supabase
      .from('user_calendar_tokens')
      .upsert({
        user_id: session.user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date,
        created_at: new Date().toISOString()
      })
      .select();

    // Redirect back to the calendar page
    return NextResponse.redirect('/flow');
  } catch (error) {
    console.error('Error in calendar callback:', error);
    // Redirect to calendar page with error
    return NextResponse.redirect('/flow?error=calendar_connection_failed');
  }
}
