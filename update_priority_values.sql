-- 1. Drop the existing check constraint if it exists (name might vary, so we try a common one or just alter the column type to be safe)
-- We will assume a check constraint named "tasks_priority_check" or similar exists.
-- If you are using an ENUM type, the approach is different. Assuming TEXT column with CHECK constraint for now based on typical Supabase patterns.

DO $$
BEGIN
    -- Try to drop the constraint if it exists
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tasks_priority_check') THEN
        ALTER TABLE tasks DROP CONSTRAINT tasks_priority_check;
    END IF;
END $$;

-- 2. Update existing data to match new Spanish values
UPDATE tasks SET priority = 'Alto' WHERE priority = 'high';
UPDATE tasks SET priority = 'Medio' WHERE priority = 'medium';
UPDATE tasks SET priority = 'Bajo' WHERE priority = 'low';

-- 3. Add the new check constraint
ALTER TABLE tasks 
ADD CONSTRAINT tasks_priority_check 
CHECK (priority IN ('Alto', 'Medio', 'Bajo'));

-- 4. Optional: Set default value to 'Medio'
ALTER TABLE tasks 
ALTER COLUMN priority SET DEFAULT 'Medio';
