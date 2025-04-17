import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
    }

    // Get the code and potential error from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/flow?error=oauth_' + error, request.url));
    }

    if (!code) {
      console.error('No authorization code received');
      return NextResponse.redirect(new URL('/flow?error=no_code', request.url));
    }

    // Initialize OAuth client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/calendar/callback`  // Make sure this matches exactly what's configured in Google Console
    );

    try {
      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);

      // Initialize Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );

      // Store tokens in database
      const { error: dbError } = await supabase
        .from('user_calendar_tokens')
        .upsert({
          user_id: session.user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to store tokens');
      }

      // Successful connection
      return NextResponse.redirect(new URL('/flow?calendar=connected', request.url));
    } catch (tokenError) {
      console.error('Token exchange error:', tokenError);
      return NextResponse.redirect(new URL('/flow?error=token_exchange', request.url));
    }
  } catch (error) {
    console.error('Calendar callback error:', error);
    return NextResponse.redirect(new URL('/flow?error=callback_failed', request.url));
  }
}
