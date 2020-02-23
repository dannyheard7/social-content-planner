import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileTable1582397013413 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY, "user_id" TEXT NOT NULL, "filename" varchar(50) NOT NULL, "ext" varchar(10) NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
