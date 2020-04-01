ALTER TABLE post_platform_connection ADD COLUMN platform_entity_id text;
ALTER TABLE post_platform_connection ADD COLUMN platform_entity_url text;

ALTER TABLE post ADD COLUMN created_at timestamp NOT NULL DEFAULT NOW();
ALTER TABLE post ADD COLUMN updated_at timestamp NOT NULL DEFAULT NOW();