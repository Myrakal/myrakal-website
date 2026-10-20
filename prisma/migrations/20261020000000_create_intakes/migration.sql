-- CreateTable
CREATE TABLE "intakes" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "transcript" JSONB NOT NULL,

    CONSTRAINT "intakes_pkey" PRIMARY KEY ("id")
);


ALTER TABLE "intakes" ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON "intakes" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON "intakes" FROM authenticated;
  END IF;
END $$;
