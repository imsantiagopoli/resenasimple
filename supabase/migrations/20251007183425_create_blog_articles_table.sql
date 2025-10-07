/*
  # Create Blog Articles Table

  1. New Tables
    - `blog_articles`
      - `id` (uuid, primary key) - Unique identifier for the article
      - `user_id` (uuid, foreign key) - Reference to auth.users, author of the article
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly version of the title
      - `excerpt` (text) - Short summary/description of the article
      - `content` (text) - Full article content (supports markdown/HTML)
      - `featured_image_url` (text, nullable) - URL to featured image
      - `published` (boolean) - Whether the article is published or draft
      - `published_at` (timestamptz, nullable) - When the article was published
      - `created_at` (timestamptz) - When the article was created
      - `updated_at` (timestamptz) - When the article was last updated

  2. Security
    - Enable RLS on `blog_articles` table
    - Add policy for anyone to read published articles (public access)
    - Add policy for authenticated users to read their own articles (including drafts)
    - Add policy for authenticated users to create their own articles
    - Add policy for authenticated users to update their own articles
    - Add policy for authenticated users to delete their own articles

  3. Indexes
    - Index on `slug` for fast lookups
    - Index on `published` and `published_at` for efficient filtering
    - Index on `user_id` for author queries
*/

-- Create blog_articles table
CREATE TABLE IF NOT EXISTS blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  featured_image_url text,
  published boolean DEFAULT false NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Anyone can view published articles"
  ON blog_articles FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can view their own articles (including drafts)
CREATE POLICY "Users can view own articles"
  ON blog_articles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can create articles
CREATE POLICY "Users can create own articles"
  ON blog_articles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can update their own articles
CREATE POLICY "Users can update own articles"
  ON blog_articles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can delete their own articles
CREATE POLICY "Users can delete own articles"
  ON blog_articles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON blog_articles(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_user_id ON blog_articles(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS update_blog_articles_updated_at_trigger ON blog_articles;
CREATE TRIGGER update_blog_articles_updated_at_trigger
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_articles_updated_at();