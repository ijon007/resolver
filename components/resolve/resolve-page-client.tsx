"use client"

import { useState } from "react"
import { PrHeader } from "@/components/resolve/PrHeader"
import { PrInfo } from "@/components/resolve/PrInfo"
import { ConflictsList } from "@/components/resolve/ConflictsList"
import { FileContent } from "@/components/resolve/FileContent"

interface ResolvePageClientProps {
  prId: string
}

export function ResolvePageClient({ prId }: ResolvePageClientProps) {
  const [selectedFile, setSelectedFile] = useState(0)

  return (
    <div className="container mx-auto p-4">
      <PrHeader />
      <PrInfo />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConflictsList 
          selectedFile={selectedFile} 
          onFileSelect={setSelectedFile} 
        />
        <FileContent selectedFile={selectedFile} />
      </div>
    </div>
  )
}
