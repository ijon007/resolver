import { GitBranchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PrHeaderProps {
  pr: any
}

export function PrHeader({ pr }: PrHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <GitBranchIcon className="h-5 w-5" />
          <h1 className="text-xl font-semibold">{pr.title}</h1>
          <Badge variant="secondary">#{pr.number}</Badge>
        </div>
      </div>
    </div>
  )
}
