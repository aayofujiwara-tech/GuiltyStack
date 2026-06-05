-- GuiltyStack initial schema

CREATE TABLE IF NOT EXISTS contents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users NOT NULL,
  title            TEXT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN ('game','book','manga','movie','anime')),
  price            INTEGER NOT NULL,
  purchased_at     DATE NOT NULL,
  release_date     DATE NOT NULL,
  freshness_source TEXT DEFAULT 'manual' CHECK (freshness_source IN ('manual','api')),
  platform         TEXT,
  cover_image_url  TEXT,
  status           TEXT DEFAULT 'unplayed' CHECK (status IN ('unplayed','in_progress','completed','abandoned')),
  tags             TEXT[],
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roast_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id  UUID REFERENCES contents ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users,
  roast_text  TEXT NOT NULL,
  score_at    INTEGER,
  shown_at    TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE roast_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own contents"
  ON contents FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own roast_history"
  ON roast_history FOR ALL
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contents_updated_at
  BEFORE UPDATE ON contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
