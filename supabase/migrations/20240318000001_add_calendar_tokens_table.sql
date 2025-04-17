-- Create table for storing Google Calendar tokens
create table if not exists public.user_calendar_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  access_token text not null,
  refresh_token text,
  expiry_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add RLS policies
alter table public.user_calendar_tokens enable row level security;

create policy "Users can view their own calendar tokens"
  on public.user_calendar_tokens for select
  using (auth.uid() = user_id);

create policy "Users can update their own calendar tokens"
  on public.user_calendar_tokens for update
  using (auth.uid() = user_id);

-- Add function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add trigger for updated_at
create trigger handle_updated_at
  before update on public.user_calendar_tokens
  for each row
  execute function public.handle_updated_at();
