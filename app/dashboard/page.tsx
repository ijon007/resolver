"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, GitBranch, AlertTriangle } from "lucide-react"

export default function Page() {
  const [prUrl, setPrUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Github className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Conflict Resolver</h1>
        </div>
        <p className="text-muted-foreground">
          Paste a GitHub PR URL and let AI resolve merge conflicts automatically
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Resolve Merge Conflicts
          </CardTitle>
          <CardDescription>
            Enter a GitHub pull request URL to start resolving conflicts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Example: https://github.com/facebook/react/pull/12345</p>
      </div>
    </div>
  )
}
