create table daily_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  goal text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table daily_goals enable row level security;

create policy "Users can insert their own goals" on daily_goals for
insert with check (auth.uid() = user_id);

create policy "Users can delete their own goals" on daily_goals for
delete using (auth.uid() = user_id);

create policy "Users can select their own goals" on daily_goals for
select using (auth.uid() = user_id);
