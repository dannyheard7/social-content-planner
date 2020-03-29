import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostTable1582453655659 implements MigrationInterface {
  name = 'AddPostTable1582453655659';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), text TEXT, "user_id" TEXT NOT NULL, PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_image" ("post_id" uuid NOT NULL REFERENCES post(id), "image_id" uuid NOT NULL REFERENCES file(id),  PRIMARY KEY ("post_id", "image_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_platform_connection" ("post_id" uuid NOT NULL REFERENCES "post"("id"), "platform_connection_id" uuid NOT NULL REFERENCES platform_connection("id"), PRIMARY KEY ("post_id", "platform_connection_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "post_platform_connection"`);
    await queryRunner.query(`DROP TABLE "post_image"`);
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
