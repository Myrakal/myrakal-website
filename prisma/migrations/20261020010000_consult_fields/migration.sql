-- AlterTable
ALTER TABLE "intakes" ADD COLUMN "consult_status" TEXT NOT NULL DEFAULT 'awaiting_payment',
ADD COLUMN "paid_at" TIMESTAMPTZ(6),
ADD COLUMN "stripe_session_id" TEXT,
ADD COLUMN "consult_note" TEXT,
ADD COLUMN "reviewed_at" TIMESTAMPTZ(6);

-- CreateIndex
CREATE UNIQUE INDEX "intakes_stripe_session_id_key" ON "intakes"("stripe_session_id");
