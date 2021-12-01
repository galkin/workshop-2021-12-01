import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1638371640552 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(254) NOT NULL,
        "password_hash" character varying(254) NOT NULL,
        "created_date" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_date" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users;`);
  }
}
