CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE post ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), text TEXT, "user_id" TEXT NOT NULL, PRIMARY KEY ("id"));

CREATE TYPE platform AS ENUM ('FACEBOOK', ' TWITTER');
CREATE TABLE platform_connection ("id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY, "userId" TEXT NOT NULL, "platform" platform NOT NULL, "accessToken" TEXT NOT NULL, "accessTokenSecret" TEXT, "entityId" TEXT NOT NULL, "entityName" TEXT NOT NULL);

CREATE TABLE post_platform_connection ("post_id" uuid NOT NULL REFERENCES "post"("id"), "platform_connection_id" uuid NOT NULL REFERENCES platform_connection("id"), PRIMARY KEY ("post_id", "platform_connection_id"));

CREATE TABLE file ("id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY, "user_id" TEXT NOT NULL, "filename" varchar(50) NOT NULL, "ext" varchar(10) NOT NULL);
CREATE TABLE post_media ("post_id" uuid NOT NULL REFERENCES post(id), "file_id" uuid NOT NULL REFERENCES file(id),  PRIMARY KEY ("post_id", "file_id"));