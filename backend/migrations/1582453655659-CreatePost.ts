import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePost1582453655659 implements MigrationInterface {
  name = 'CreatePost1582453655659';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), text TEXT, PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_image" ("post_id" uuid NOT NULL REFERENCES post(id), "image_id" uuid NOT NULL REFERENCES file(id),  PRIMARY KEY ("post_id", "image_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_network" ("post_id" uuid NOT NULL REFERENCES "post"("id"), "network" character varying NOT NULL, PRIMARY KEY ("post_id", "network"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "post_network"`, undefined);
    await queryRunner.query(`DROP TABLE "post_image"`, undefined);
    await queryRunner.query(`DROP TABLE "post"`, undefined);
  }
}
