ALTER TABLE post_platform_connection
DROP CONSTRAINT post_platform_connection_platform_connection_id_fkey;

ALTER TABLE post_platform_connection
add CONSTRAINT post_platform_connection_platform_connection_id_fkey
foreign key (platform_connection_id)
references platform_connection (id)
ON DELETE SET NULL;

ALTER TABLE post_platform_connection ALTER platform_connection_id DROP NOT NULL;

ALTER TABLE post_platform_connection ADD COLUMN platform platform NOT NULL;