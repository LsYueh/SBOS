CREATE TABLE IF NOT EXISTS sbos.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);