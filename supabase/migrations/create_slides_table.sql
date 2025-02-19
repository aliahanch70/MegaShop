create table public.slides (
  id uuid default gen_random_uuid() primary key,
  title text,
  description text,
  image_url text not null,
  button_text text,
  button_link text,
  order_number integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.slides enable row level security;

-- Create policies
create policy "Slides are viewable by everyone" on slides
  for select using (true);

create policy "Slides are editable by authenticated users" on slides
  for all using (auth.role() = 'authenticated');
