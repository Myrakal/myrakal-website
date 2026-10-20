-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

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
