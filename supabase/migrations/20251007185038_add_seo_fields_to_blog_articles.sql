/*
  # Add SEO Fields to Blog Articles

  1. New Columns
    - `meta_title` (text, nullable) - SEO optimized title (60 chars recommended)
    - `meta_description` (text, nullable) - SEO meta description (160 chars recommended)
    - `meta_keywords` (text, nullable) - SEO keywords (comma separated)
    - `og_title` (text, nullable) - Open Graph title for social sharing
    - `og_description` (text, nullable) - Open Graph description for social sharing
    - `og_image_url` (text, nullable) - Open Graph image URL for social sharing
    - `canonical_url` (text, nullable) - Canonical URL for SEO
    - `focus_keyword` (text, nullable) - Primary focus keyword for SEO
    - `reading_time` (integer, nullable) - Estimated reading time in minutes

  2. Notes
    - All fields are optional (nullable) to maintain backward compatibility
    - These fields follow SEO best practices for content optimization
*/

-- Add SEO meta fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'meta_title'
  ) THEN
    ALTER TABLE blog_articles ADD COLUMN meta_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE blog_articles ADD COLUMN meta_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'meta_keywords'
  ) THEN
    ALTER TABLE blog_articles ADD COLUMN meta_keywords text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'og_title'
  ) THEN
    ALTER TABLE blog_articles ADD COLUMN og_title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'og_description'
  ) THEN
    ALTER TABLE blog_articles ADD COLUMN og_description text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'og_image_url'
  ) THEN
    ALTER TABLE blog_articles ADD COLUMN og_image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'canonical_url'
  ) THEN
    ALTER TABLE blog_articles ADD COLUMN canonical_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'focus_keyword'
  ) THEN
    ALTER TABLE blog_articles ADD COLUMN focus_keyword text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_articles' AND column_name = 'reading_time'
  ) THEN
    ALTER TABLE blog_articles ADD COLUMN reading_time integer;
  END IF;
END $$;