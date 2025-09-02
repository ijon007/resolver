"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, AlertTriangle } from "lucide-react"
import { extractPrId } from "@/lib/utils"
import { signIn, useSession } from "@/lib/auth-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function PrUrlForm() {
  const [prUrl, setPrUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSignInDialog, setShowSignInDialog] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleResolve = async () => {
    if (!prUrl) return
    
    // Check if user is signed in
    if (!session) {
      setShowSignInDialog(true)
      return
    }
    
    setIsLoading(true)
    
    // Extract PR ID from GitHub URL
    const prId = extractPrId(prUrl)
    if (prId) {
      router.push(`/dashboard/${prId}`)
    } else {
      alert("Invalid GitHub PR URL")
    }
    
    setIsLoading(false)
  }

  const handleGithubSignIn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: '/dashboard',
      errorCallbackURL: '/dashboard?error=true'
    });
  }

  return (
    <>
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

      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="h-5 w-5" />
              Sign in Required
            </DialogTitle>
            <DialogDescription>
              You need to sign in with GitHub to resolve merge conflicts. This allows us to access your repositories and help resolve conflicts automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <form action={handleGithubSignIn}>
              <Button type="submit" className="w-full flex items-center gap-2">
                <Github className="h-4 w-4" />
                Sign in with GitHub
              </Button>
            </form>
            <Button 
              variant="outline" 
              onClick={() => setShowSignInDialog(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
