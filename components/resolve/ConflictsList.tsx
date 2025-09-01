import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockPrData } from "@/constants/mockData"

interface ConflictsListProps {
  selectedFile: number
  onFileSelect: (index: number) => void
}

export function ConflictsList({ selectedFile, onFileSelect }: ConflictsListProps) {
  return (
    <div className="lg:col-span-1">
      <div className="border rounded-lg">
        <div className="p-3 border-b bg-muted/30">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Conflicted Files
          </h3>
        </div>
        <div className="p-2">
          <div className="space-y-1">
            {mockPrData.conflicts.map((conflict, index) => (
              <div
                key={index}
                className={`p-2 rounded border cursor-pointer transition-colors ${
                  selectedFile === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-transparent hover:border-gray-200 hover:bg-muted/50'
                }`}
                onClick={() => onFileSelect(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">
                    {conflict.file.split('/').pop()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {conflict.conflicts}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {conflict.file}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
