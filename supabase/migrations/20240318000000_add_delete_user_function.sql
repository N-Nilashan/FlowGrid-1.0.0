-- Create function to delete all user data
create or replace function public.delete_user_data(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Delete calendar tokens
  delete from public.user_calendar_tokens where user_id = $1;

  -- Delete tasks
  delete from public.tasks where user_id = $1;

  -- Delete user preferences
  delete from public.user_preferences where user_id = $1;

  -- Delete user profile
  delete from public.profiles where id = $1;

  -- Delete auth user
  delete from auth.users where id = $1;
end;
$$;
