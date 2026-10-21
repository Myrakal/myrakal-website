import type { PrismaClient } from '../generated/prisma/client.ts'

export async function markPaid(store: Pick<PrismaClient, 'intake'>, intakeId: string) {
  const { count } = await store.intake.updateMany({
    where: { id: intakeId, consultStatus: 'awaiting_payment' },
    data: { paidAt: new Date(), consultStatus: 'in_review' },
  })
  return count > 0
}
