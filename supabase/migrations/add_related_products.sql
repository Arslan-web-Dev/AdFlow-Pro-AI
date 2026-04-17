-- Add image_urls and related_products columns to ads table
ALTER TABLE public.ads 
ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT ARRAY[]::text[],
ADD COLUMN IF NOT EXISTS related_products text[] DEFAULT ARRAY[]::text[];
