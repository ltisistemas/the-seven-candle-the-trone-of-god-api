import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1735689600000 implements MigrationInterface {
  name = 'InitialSchema1735689600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "current_level" integer NOT NULL DEFAULT 1 CHECK ("current_level" BETWEEN 1 AND 22),
        "created_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "chapters" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "chapter_number" smallint NOT NULL UNIQUE CHECK ("chapter_number" BETWEEN 1 AND 22),
        "title" varchar(160) NOT NULL,
        "region_unlocked" varchar(100) NOT NULL,
        "description" text NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO "chapters" ("chapter_number", "title", "region_unlocked", "description")
      SELECT chapter_number, 'Apocalipse ' || chapter_number,
        'region-' || chapter_number, 'Conteúdo do capítulo ' || chapter_number
      FROM generate_series(1, 22) AS chapter_number
    `);
    await queryRunner.query(`
      CREATE TABLE "player_progress" (
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "chapter_id" uuid NOT NULL REFERENCES "chapters"("id") ON DELETE RESTRICT,
        "status" varchar(20) NOT NULL CHECK ("status" IN ('LOCKED', 'IN_PROGRESS', 'COMPLETED')),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY ("user_id", "chapter_id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "inventory" (
        "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "item_key" varchar(100) NOT NULL,
        "quantity" integer NOT NULL DEFAULT 0 CHECK ("quantity" >= 0),
        PRIMARY KEY ("user_id", "item_key")
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "inventory"');
    await queryRunner.query('DROP TABLE "player_progress"');
    await queryRunner.query('DROP TABLE "chapters"');
    await queryRunner.query('DROP TABLE "users"');
  }
}