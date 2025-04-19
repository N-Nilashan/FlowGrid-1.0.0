import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function POST(request) {
  const { email } = await request.json();

  if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return new Response('Invalid email', { status: 400 });
  }

  const { data, error } = await supabase
    .from('waitlist')
    .insert({ email });

  if (error) {
    console.error('Error adding to waitlist:', error);
    return new Response('Error adding to waitlist', { status: 500 });
  }

  return new Response('Success');
}
