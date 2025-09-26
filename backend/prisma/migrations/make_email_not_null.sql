-- Make email mandatory on User
-- Safe-guard: ensure no NULL emails exist before applying NOT NULL
UPDATE "public"."User"
SET email = 'admin@test.com'
WHERE email IS NULL AND username = 'admin';

-- If any other rows still NULL, set a placeholder to avoid failure (adjust as needed)
UPDATE "public"."User"
SET email = concat('user_', substr(replace(gen_random_uuid()::text, '-', ''), 1, 8), '@example.com')
WHERE email IS NULL;

-- Enforce NOT NULL
ALTER TABLE "public"."User" ALTER COLUMN "email" SET NOT NULL;


