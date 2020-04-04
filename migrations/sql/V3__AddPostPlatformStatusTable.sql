ALTER TABLE post_platform_connection DROP CONSTRAINT post_platform_connection_pkey;
ALTER TABLE post_platform_connection ADD COLUMN id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY;

CREATE TABLE post_platform_status (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    post_id uuid NOT NULL REFERENCES post(id),
    post_platform_id uuid NOT NULL REFERENCES post_platform_connection(id),
    timestamp timestamp NOT NULL DEFAULT NOW(),
    positive_reactions_count integer NOT NULL,
    negative_reactions_count integer,
    comments_count integer NOT NULL,
    shares_count integer NOT NULL,
    custom_data jsonb
);