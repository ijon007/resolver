"use client"

import { useState } from "react"
import { Github } from "lucide-react"
import { PrUrlForm } from "@/components/dashboard/PrUrlForm"
import { RecentConflicts } from "@/components/dashboard/RecentConflicts"

export default function Page() {
  const [showEmptyState, setShowEmptyState] = useState(false)

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Github className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Conflict Resolver</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Paste a GitHub PR URL and let AI resolve merge conflicts automatically
        </p>
      </div>

      <PrUrlForm />

      <div className="mt-6">
        <RecentConflicts showEmptyState={showEmptyState} />
      </div>
    </div>
  )
}
