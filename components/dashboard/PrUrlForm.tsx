"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, AlertTriangle } from "lucide-react"
import { extractPrId } from "@/lib/utils"

export function PrUrlForm() {
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

  return (
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
  )
}
