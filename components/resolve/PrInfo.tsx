import { Badge } from "@/components/ui/badge"

interface PrInfoProps {
  pr: any
}

export function PrInfo({ pr }: PrInfoProps) {
  const getStatusColor = (state: string) => {
    switch (state) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Badge 
          variant="secondary"
          className={`text-sm ${getStatusColor(pr.state)}`}
        >
          {pr.state === "open" ? "Open" : pr.state === "closed" ? "Closed" : "Merged"}
        </Badge>
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold">{pr.user.login}</span> wants to merge {pr.commits} commit{pr.commits !== 1 ? 's' : ''} into{" "}
          <span className="font-medium font-mono border border-border bg-muted px-1 rounded-md">{pr.base.ref}</span> from{" "}
          <span className="font-medium font-mono border border-border bg-muted px-1 rounded-md">{pr.head.ref}</span>
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-green-600 font-medium">
          +{pr.additions}
        </span>
        <span className="flex items-center gap-1 text-red-600 font-medium">
          -{pr.deletions}
        </span>
        <span className="text-muted-foreground">
          {pr.repo?.full_name || pr.head?.repo?.full_name || 'Unknown repo'}
        </span>
      </div>
    </div>
  )
}
