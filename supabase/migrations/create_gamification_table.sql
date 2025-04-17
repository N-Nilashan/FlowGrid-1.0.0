-- Create gamification table
CREATE TABLE IF NOT EXISTS gamification (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    streak INTEGER DEFAULT 0,
    last_completed_date TIMESTAMP WITH TIME ZONE,
    experience INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Create RLS policies
ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own gamification data
CREATE POLICY "Users can read their own gamification data"
    ON gamification
    FOR SELECT
    USING (auth.jwt() ->> 'email' = email);

-- Policy for users to update their own gamification data
CREATE POLICY "Users can update their own gamification data"
    ON gamification
    FOR UPDATE
    USING (auth.jwt() ->> 'email' = email);

-- Policy for users to insert their own gamification data
CREATE POLICY "Users can insert their own gamification data"
    ON gamification
    FOR INSERT
    WITH CHECK (auth.jwt() ->> 'email' = email);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_gamification_updated_at
    BEFORE UPDATE ON gamification
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
