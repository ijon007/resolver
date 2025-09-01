import { Badge } from "@/components/ui/badge"
import { mockPrData } from "@/constants/mockData"

export function PrInfo() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Badge 
          variant={mockPrData.status === "open" ? "default" : mockPrData.status === "merged" ? "secondary" : "destructive"}
          className={`text-sm ${
            mockPrData.status === "open" 
              ? "bg-green-100 text-green-800 border-green-200" 
              : mockPrData.status === "merged" 
              ? "bg-purple-100 text-purple-800 border-purple-200"
              : ""
          }`}
        >
          {mockPrData.status === "open" ? "Open" : mockPrData.status === "merged" ? "Merged" : "Closed"}
        </Badge>
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold">{mockPrData.author}</span> wants to merge 1 commit into{" "}
          <span className="font-medium font-mono border border-border bg-muted px-1 rounded-md">{mockPrData.toBranch}</span> from{" "}
          <span className="font-medium font-mono border border-border bg-muted px-1 rounded-md">{mockPrData.fromBranch}</span>
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-green-600 font-medium">
          +{mockPrData.additions}
        </span>
        <span className="flex items-center gap-1 text-red-600 font-medium">
          -{mockPrData.deletions}
        </span>
        <span className="text-muted-foreground">
          {mockPrData.conflicts.length} files with conflicts
        </span>
      </div>
    </div>
  )
}
