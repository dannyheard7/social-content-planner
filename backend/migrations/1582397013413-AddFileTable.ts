import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFileTable1582397013413 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "file" (id UUID, user_id TEXT, filename VARCHAR(60), ext VARCHAR(10))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
