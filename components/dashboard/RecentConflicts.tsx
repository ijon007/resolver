"use client"

import { ConflictCard } from "./ConflictCard"
import { EmptyState } from "./EmptyState"
import { mockConflicts } from "@/constants/mockData"
import { useSession } from "@/lib/auth-client"

interface RecentConflictsProps {
  showEmptyState?: boolean
}

export function RecentConflicts({ showEmptyState = false }: RecentConflictsProps) {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  if (showEmptyState || mockConflicts.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Recent Conflicts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {mockConflicts.map((conflict) => (
          <ConflictCard key={conflict.id} conflict={conflict} />
        ))}
      </div>
    </div>
  )
}
