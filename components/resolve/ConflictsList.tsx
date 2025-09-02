import { FileText, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ConflictsListProps {
  files: any[]
  selectedFile: number
  onFileSelect: (index: number) => void
  hasConflicts?: boolean
}

export function ConflictsList({ files, selectedFile, onFileSelect, hasConflicts }: ConflictsListProps) {
  const conflictedFiles = (files || []).filter(file => file.status === 'modified' || file.status === 'added')



  return (
    <div className="lg:col-span-1">
      <div className="border rounded-lg">
        <div className="p-3 border-b bg-muted/30">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Files ({conflictedFiles.length})
          </h3>
        </div>
        <div className="p-2">
          <div className="space-y-1">
            {conflictedFiles.map((file, index) => (
              <div
                key={index}
                className={`p-2 rounded border cursor-pointer transition-colors ${
                  selectedFile === index 
                    ? 'border-primary bg-primary/10' 
                    : 'border-transparent hover:border-border hover:bg-muted/50'
                }`}
                onClick={() => onFileSelect(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">
                    {file.filename.split('/').pop()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {file.changes}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {file.filename}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
