import { MigrationInterface, QueryRunner } from "typeorm";

export class PlatformConnectionAccessTokenSecret1585387680880 implements MigrationInterface {
    name = 'PlatformConnectionAccessTokenSecret1585387680880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE platform_connection ALTER COLUMN platform TYPE VARCHAR(255);`
        );
        await queryRunner.query(
            `DROP TYPE IF EXISTS platform;
            CREATE TYPE platform AS ENUM ('FACEBOOK', 'TWITTER');`
        );
        await queryRunner.query(
            `ALTER TABLE platform_connection ALTER COLUMN platform TYPE platform USING (platform::platform);`
        );
        await queryRunner.query(`ALTER TABLE platform_connection ADD COLUMN "accessTokenSecret" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE platform_connection DROP COLUMN "accessTokenSecret"`);
    }
}
