import { Github } from "lucide-react"

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Github className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium text-sm">No conflicts yet</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Resolve your first merge conflict to see it here
          </p>
        </div>
      </div>
    </div>
  )
}
