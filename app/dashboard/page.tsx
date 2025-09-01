"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Github, GitBranch, AlertTriangle, CheckCircle, User } from "lucide-react"
import Link from "next/link"

export default function Page() {
  const [prUrl, setPrUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showEmptyState, setShowEmptyState] = useState(false)
  const router = useRouter()

  const handleResolve = async () => {
    if (!prUrl) return
    
    setIsLoading(true)
    
    // Extract PR ID from GitHub URL
    const prId = extractPrId(prUrl)
    if (prId) {
      router.push(`/resolve/${prId}`)
    } else {
      alert("Invalid GitHub PR URL")
    }
    
    setIsLoading(false)
  }

  const extractPrId = (url: string) => {
    // Extract repo and PR number from GitHub URL
    // Example: https://github.com/owner/repo/pull/123 -> owner/repo/123
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/)
    if (match) {
      return `${match[1]}/${match[2]}/${match[3]}`
    }
    return null
  }

  // Mock data for conflicts with different states
  const mockConflicts = [
    {
      id: 1,
      title: "Add user authentication system",
      repo: "facebook/react",
      prNumber: 12345,
      author: "john-doe",
      updatedAt: "2 hours ago",
      status: "open"
    },
    {
      id: 2,
      title: "Fix responsive design issues",
      repo: "vercel/next.js",
      prNumber: 9876,
      author: "jane-smith",
      updatedAt: "1 day ago",
      status: "resolved"
    },
    {
      id: 3,
      title: "Update API documentation",
      repo: "microsoft/vscode",
      prNumber: 5432,
      author: "alex-wilson",
      updatedAt: "3 days ago",
      status: "merged"
    },
    {
      id: 4,
      title: "Implement dark mode toggle",
      repo: "tailwindlabs/tailwindcss",
      prNumber: 8765,
      author: "sarah-jones",
      updatedAt: "1 week ago",
      status: "open"
    },
    {
      id: 5,
      title: "Add unit tests for utils",
      repo: "lodash/lodash",
      prNumber: 4321,
      author: "mike-chen",
      updatedAt: "2 weeks ago",
      status: "resolved"
    },
    {
      id: 6,
      title: "Optimize bundle size",
      repo: "webpack/webpack",
      prNumber: 7654,
      author: "emma-davis",
      updatedAt: "3 weeks ago",
      status: "merged"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "merged":
        return <GitBranch className="h-4 w-4 text-purple-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Open"
      case "resolved":
        return "Resolved"
      case "merged":
        return "Merged"
      default:
        return "Unknown"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-orange-600"
      case "resolved":
        return "text-green-600"
      case "merged":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

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

      <div className="border rounded-lg p-4 space-y-3">
        <div className="space-y-1">
          <label htmlFor="pr-url" className="text-sm font-medium">
            GitHub PR URL
          </label>
          <Input
            id="pr-url"
            placeholder="https://github.com/owner/repo/pull/123"
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button 
          onClick={handleResolve}
          disabled={!prUrl || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <AlertTriangle className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              Resolve Conflicts
            </>
          )}
        </Button>
      </div>

      <div className="mt-6">
        {showEmptyState || mockConflicts.length === 0 ? (
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
        ) : (
          <div>
            <h2 className="text-lg font-semibold mb-2">Recent Conflicts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mockConflicts.map((conflict) => (
                <Link key={conflict.id} href={`/dashboard/${conflict.id}`} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
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
              ))}
              </div>
          </div>
        )}
      </div>
    </div>
  )
}
