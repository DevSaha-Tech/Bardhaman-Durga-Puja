-- 1. Pandal Visits Table
CREATE TABLE IF NOT EXISTS pandal_visits (
  id BIGSERIAL PRIMARY KEY,
  pandal_id VARCHAR(50) NOT NULL,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pandal_visits_id_time ON pandal_visits(pandal_id, visited_at);

-- 2. Fast-Tag Reviews Table
CREATE TABLE IF NOT EXISTS pandal_reviews (
  id BIGSERIAL PRIMARY KEY,
  pandal_id VARCHAR(50) NOT NULL,
  tag VARCHAR(50) NOT NULL,
  comment TEXT DEFAULT '',
  user_name VARCHAR(100) DEFAULT 'দর্শনার্থী',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_pandal ON pandal_reviews(pandal_id);

-- 3. Unique Platform Analytics
CREATE TABLE IF NOT EXISTS site_views (
  id BIGSERIAL PRIMARY KEY,
  user_uuid VARCHAR(100) UNIQUE NOT NULL,
  first_visited TIMESTAMPTZ DEFAULT NOW()
);
