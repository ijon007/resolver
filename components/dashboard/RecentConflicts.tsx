"use client"

import { useEffect, useState } from "react"
import { ConflictCard } from "./ConflictCard"
import { EmptyState } from "./EmptyState"
import { useSession } from "@/lib/auth-client"
import { fetchUserPRs } from "@/actions/github"

interface RecentConflictsProps {
  showEmptyState?: boolean
}

export function RecentConflicts({ showEmptyState = false }: RecentConflictsProps) {
  const { data: session } = useSession()
  const [prs, setPrs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchUserPRs()
        .then((data) => setPrs(Array.isArray(data) ? data : []))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [session])

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">Your PRs</h2>
        <div className="text-center py-4">Loading...</div>
      </div>
    )
  }

  if (showEmptyState || prs.length === 0) {
    return <EmptyState />
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Your PRs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {prs.map((pr) => (
          <ConflictCard 
            key={pr.id} 
            conflict={{
              id: pr.id,
              title: pr.title,
              repo: pr.repository_url.split('/').slice(-2).join('/'),
              prNumber: pr.number,
              author: pr.user.login,
              updatedAt: new Date(pr.updated_at).toLocaleDateString(),
              status: pr.state
            }} 
          />
        ))}
      </div>
    </div>
  )
}
