"use client"

import { useState } from "react"
import { CheckCircle, Github, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PrHeader } from "@/components/resolve/PrHeader"
import { PrInfo } from "@/components/resolve/PrInfo"
import { ConflictsList } from "@/components/resolve/ConflictsList"
import { FileContent } from "@/components/resolve/FileContent"

interface ResolvePageClientProps {
  prId: string
  pr: any
  files: any
}

export function ResolvePageClient({ prId, pr, files }: ResolvePageClientProps) {
  const [selectedFile, setSelectedFile] = useState(0)
  
  console.log("ResolvePageClient props:", { prId, pr, files })

  // Check if there are any files with conflicts
  const hasConflicts = files?.files?.some((file: any) => 
    file.status === 'modified' || file.status === 'added'
  )

  if (!hasConflicts) {
    return (
      <div className="container mx-auto p-4">
        <PrHeader pr={pr} />
        <PrInfo pr={pr} />
        
        <div className="mt-8">
          <div className="border rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <h2 className="text-2xl font-semibold">No conflicts for this PR</h2>
              <p className="text-muted-foreground">This pull request is ready to merge</p>
              <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Button className="h-7">
                  <Github className="h-4 w-4" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <PrHeader pr={pr} />
      <PrInfo pr={pr} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConflictsList 
          files={files.files}
          selectedFile={selectedFile} 
          onFileSelect={setSelectedFile}
          hasConflicts={hasConflicts}
        />
        <FileContent 
          files={files.files}
          selectedFile={selectedFile}
          hasConflicts={hasConflicts}
        />
      </div>
    </div>
  )
}
