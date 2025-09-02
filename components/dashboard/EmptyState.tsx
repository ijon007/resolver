import { Github } from "lucide-react"

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Github className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-sm">No open PRs</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Create a pull request or paste a GitHub PR URL above to get started
          </p>
        </div>
      </div>
    </div>
  )
}
