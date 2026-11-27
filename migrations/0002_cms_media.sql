CREATE TABLE IF NOT EXISTS cms_media (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image/jpeg', 'image/png', 'image/webp')),
  bytes BLOB NOT NULL CHECK (length(bytes) BETWEEN 1 AND 1572864)
);
