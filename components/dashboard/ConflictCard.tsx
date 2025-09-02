import Link from "next/link"
import { Github, User, AlertTriangle, CheckCircle, GitBranch } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getStatusText, getStatusColor } from "@/lib/utils"

interface ConflictCardProps {
  conflict: {
    id: number
    title: string
    repo: string
    prNumber: number
    author: string
    updatedAt: string
    status: string
  }
}

export function ConflictCard({ conflict }: ConflictCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4 text-green-600" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "merged":
        return <GitBranch className="h-4 w-4 text-purple-600" />
      case "closed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }
  
  return (
    <Link 
      href={`/dashboard/${conflict.repo}/${conflict.prNumber}`} 
      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(conflict.status)}
          <span className={`text-xs font-medium ${getStatusColor(conflict.status)}`}>
            {getStatusText(conflict.status)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{conflict.updatedAt}</span>
      </div>
      <h3 className="font-medium text-sm mb-1 line-clamp-2">{conflict.title}</h3>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
        <Github className="h-3 w-3" />
        <span>{conflict.repo}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>{conflict.author}</span>
        </div>
        <span>#{conflict.prNumber}</span>
      </div>
    </Link>
  )
}
