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
  version?: number
}

export function CaseOverview({ chatId, status, intake, priceCents, paid, progress, version = 0 }: Props) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[3fr_2fr]">
      <OnFileCard intake={intake ?? {}} status={status} progress={progress} />
      <div className="flex flex-col gap-4">
        <AttachmentsCard chatId={chatId} version={version} />
        <PriceCard status={status} priceCents={priceCents ?? null} paid={paid ?? false} />
      </div>
    </div>
  )
}
