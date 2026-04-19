-- Add missing priority column to existing ads table
ALTER TABLE ads ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- Update all existing ads with random priority values (1-10)
UPDATE ads SET priority = 5 WHERE priority = 0;

-- Create index for priority ordering
CREATE INDEX IF NOT EXISTS idx_ads_priority ON ads(priority);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ads' AND column_name = 'priority';
