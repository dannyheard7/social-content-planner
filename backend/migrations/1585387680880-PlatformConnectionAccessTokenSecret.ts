import { MigrationInterface, QueryRunner } from "typeorm";

export class PlatformConnectionAccessTokenSecret1585387680880 implements MigrationInterface {
    name = 'PlatformConnectionAccessTokenSecret1585387680880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE platform ADD VALUE 'TWITTER';`
        );
        await queryRunner.query(`ALTER TABLE "platformConnection" ADD "accessTokenSecret" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "platformConnection" DROP COLUMN "accessTokenSecret"`);
    }
}
