"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Github, ArrowLeft, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PrHeader } from "@/components/resolve/PrHeader"
import { PrInfo } from "@/components/resolve/PrInfo"
import { ConflictsList } from "@/components/resolve/ConflictsList"
import { FileContent } from "@/components/resolve/FileContent"
import { AIResolutionViewer } from "@/components/resolve/AIResolutionViewer"
import { triggerConflictResolutionWorkflow, getWorkflowRuns, getWorkflowRunArtifacts, downloadArtifact } from "@/actions/github-workflow"
import { batchCommitResolutions, downloadAndParseArtifact } from "@/actions/github-batch-commit"

interface ResolvePageClientProps {
  prId: string
  pr: any
  files: any
}

export function ResolvePageClient({ prId, pr, files }: ResolvePageClientProps) {
  const [selectedFile, setSelectedFile] = useState(0)
  const [isTriggeringWorkflow, setIsTriggeringWorkflow] = useState(false)
  const [isCommitting, setIsCommitting] = useState(false)
  const [workflowStatus, setWorkflowStatus] = useState<string | null>(null)
  const [resolvedFiles, setResolvedFiles] = useState<any[]>([])
  
  console.log("ResolvePageClient props:", { prId, pr, files })

  // Check if there are any files with conflicts
  const hasConflicts = files?.hasConflicts || files?.files?.some((file: any) => 
    file.hasConflict || (file.status === 'modified' || file.status === 'added')
  )

  const hasResolutions = files?.hasResolutions || resolvedFiles.length > 0

  // Fetch AI resolutions on mount if available
  useEffect(() => {
    const fetchResolutions = async () => {
      if (files?.workflowRun?.id) {
        try {
          const [owner, repo] = prId.split('/')
          const artifacts = await getWorkflowRunArtifacts(owner, repo, files.workflowRun.id)
          const resolvedArtifact = artifacts.find((artifact: any) => artifact.name === 'resolved-conflicts')
          
          if (resolvedArtifact) {
            const result = await downloadAndParseArtifact(prId, resolvedArtifact.id)
            if (result.success && result.resolvedFiles) {
              setResolvedFiles(result.resolvedFiles)
            }
          }
        } catch (error) {
          console.error('Failed to fetch AI resolutions:', error)
        }
      }
    }

    fetchResolutions()
  }, [files?.workflowRun, prId])

  const handleTriggerWorkflow = async () => {
    if (!pr) return
    
    setIsTriggeringWorkflow(true)
    setWorkflowStatus('Triggering workflow...')
    
    try {
      const [owner, repo, prNumber] = prId.split('/')
      const result = await triggerConflictResolutionWorkflow(
        owner,
        repo,
        prNumber,
        pr.base.ref,
        pr.head.ref
      )
      
      if (result.success) {
        setWorkflowStatus('Workflow triggered successfully! Check GitHub Actions for progress.')
      } else {
        setWorkflowStatus(`Error: ${result.error}`)
      }
    } catch (error) {
      setWorkflowStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsTriggeringWorkflow(false)
    }
  }

  const handleCommitResolutions = async () => {
    if (resolvedFiles.length === 0) return
    
    setIsCommitting(true)
    
    try {
      const result = await batchCommitResolutions(
        prId,
        resolvedFiles,
        `AI: Resolve merge conflicts in ${resolvedFiles.length} files`
      )
      
      if (result.success) {
        setWorkflowStatus(`Successfully committed ${result.filesResolved} resolved files!`)
        // Refresh the page or update state
        window.location.reload()
      } else {
        setWorkflowStatus(`Error: ${result.error}`)
      }
    } catch (error) {
      setWorkflowStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCommitting(false)
    }
  }

  if (!hasConflicts && !hasResolutions) {
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

  if (hasConflicts && !hasResolutions) {
    return (
      <div className="container mx-auto p-4">
        <PrHeader pr={pr} />
        <PrInfo pr={pr} />
        
        <div className="mt-8">
          <div className="border rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-2xl font-semibold">Conflicts Detected</h2>
              <p className="text-muted-foreground">
                This PR has merge conflicts that need to be resolved.
              </p>
              <Button 
                onClick={handleTriggerWorkflow}
                disabled={isTriggeringWorkflow}
                className="h-10"
              >
                {isTriggeringWorkflow ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isTriggeringWorkflow ? 'Triggering...' : 'Start AI Resolution'}
              </Button>
              {workflowStatus && (
                <p className="text-sm text-muted-foreground mt-2">{workflowStatus}</p>
              )}
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
      
      {workflowStatus && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">{workflowStatus}</p>
        </div>
      )}
      
      {hasResolutions ? (
        <div className="mt-6">
          <AIResolutionViewer
            resolvedFiles={resolvedFiles}
            onAcceptAll={handleCommitResolutions}
            onAcceptFile={(filename) => {
              // For now, just accept all when individual file is selected
              handleCommitResolutions()
            }}
            isCommitting={isCommitting}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ConflictsList 
            files={files.files || resolvedFiles}
            selectedFile={selectedFile} 
            onFileSelect={setSelectedFile}
            hasConflicts={hasConflicts}
          />
          <FileContent 
            files={files.files || resolvedFiles}
            selectedFile={selectedFile}
            hasConflicts={hasConflicts}
            prId={prId}
            pr={pr}
          />
        </div>
      )}
    </div>
  )
}
