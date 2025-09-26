-- Reset public schema (drop FKs, tables, and recreate per current schema)
-- RUN THIS IN SUPABASE SQL EDITOR

-- 0) Optional: enable required extensions
-- create extension if not exists pgcrypto;

-- 1) Drop FKs if exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'User_roleId_fkey'
  ) THEN
    ALTER TABLE "public"."User" DROP CONSTRAINT "User_roleId_fkey";
  END IF;
END$$;

-- 2) Drop tables if exist (order matters)
DROP TABLE IF EXISTS "public"."User" CASCADE;
DROP TABLE IF EXISTS "public"."Role" CASCADE;

-- 3) Recreate tables
CREATE TABLE "public"."Role" (
  "id" TEXT NOT NULL,
  "rolename" TEXT NOT NULL,
  CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Role_rolename_key" ON "public"."Role"("rolename");

CREATE TABLE "public"."User" (
  "id" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "email" TEXT,
  "name" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "roleId" TEXT NOT NULL DEFAULT '2',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey"
  FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- 4) Seed essential roles (idempotent)
INSERT INTO "public"."Role" ("id", "rolename") VALUES ('1','Admin') ON CONFLICT ("id") DO NOTHING;
INSERT INTO "public"."Role" ("id", "rolename") VALUES ('2','Client') ON CONFLICT ("id") DO NOTHING;

-- 5) Ensure one admin user exists (username: admin, password: test)
-- If pgcrypto is available, use bcrypt via crypt(); otherwise run npm seed after applying schema
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "public"."User" WHERE username = 'admin') THEN
    INSERT INTO "public"."User"(id, username, email, name, password, "roleId", "isActive")
    VALUES (gen_random_uuid(), 'admin', 'admin@test.com', 'Admin', crypt('test', gen_salt('bf', 10)), '1', true);
  END IF;
END$$;


