import { GitBranchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockPrData } from "@/constants/mockData"

export function PrHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <GitBranchIcon className="h-5 w-5" />
          <h1 className="text-xl font-semibold">{mockPrData.title}</h1>
          <Badge variant="secondary">#{mockPrData.number}</Badge>
        </div>
      </div>
    </div>
  )
}
