import { AttachmentsCard } from './AttachmentsCard'
import { OnFileCard } from './OnFileCard'
import { PriceCard } from './PriceCard'

type Props = {
  chatId: string
  status: string
  intake?: Record<string, string | boolean>
  priceCents?: number | null
  paid?: boolean
  progress?: { collected: number; total: number } | null
}

export function CaseOverview({ chatId, status, intake, priceCents, paid, progress }: Props) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[3fr_2fr]">
      <OnFileCard intake={intake ?? {}} status={status} progress={progress} />
      <div className="flex flex-col gap-4">
        <AttachmentsCard chatId={chatId} version={0} />
        <PriceCard status={status} priceCents={priceCents ?? null} paid={paid ?? false} />
      </div>
    </div>
  )
}
