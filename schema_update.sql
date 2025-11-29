-- 1. Add new columns to 'tasks' table
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

-- 2. Create 'subtasks' table
CREATE TABLE IF NOT EXISTS subtasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create 'comments' table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for Subtasks
-- Allow read access to everyone (or restrict to project members if you have that logic)
CREATE POLICY "Enable read access for all users" ON subtasks FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Enable insert for authenticated users" ON subtasks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON subtasks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON subtasks FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Create Policies for Comments
-- Allow read access to everyone
CREATE POLICY "Enable read access for all users" ON comments FOR SELECT USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Enable insert for authenticated users" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update/delete ONLY their own comments
CREATE POLICY "Enable update for own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for own comments" ON comments FOR DELETE USING (auth.uid() = user_id);
