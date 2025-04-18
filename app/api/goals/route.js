import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function GET(request) {
  const { data, error } = await supabase
    .from('daily_goals')
    .select('*')
    .eq('user_id', request.headers.get('Authorization'))
    .gte('created_at', new Date().toISOString().slice(0, 10));

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
  const { goal } = await request.json();

  const { data, error } = await supabase
    .from('daily_goals')
    .insert({
      user_id: request.headers.get('Authorization'),
      goal
    });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const goalId = url.pathname.split('/').pop();

  const { data, error } = await supabase
    .from('daily_goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', request.headers.get('Authorization'));

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
