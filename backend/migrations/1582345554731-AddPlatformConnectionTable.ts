import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlatformConnectionTable1582345554731
  implements MigrationInterface {
  name = 'AddPlatformConnectionTable1582345554731';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "platformConnection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY, "userId" TEXT NOT NULL, "platform" varchar(50) NOT NULL, "accessToken" TEXT NOT NULL, "entityId" TEXT NOT NULL, "entityName" TEXT NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "platformConnection"`);
  }
}
