"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Bot,
  Github
} from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getLanguageFromFile } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"
import { resolveConflict } from "@/actions/ai-resolve"
import { applyResolutionToGitHub } from "@/actions/github-resolve"
import { toast } from "sonner"

interface FileContentProps {
  files: any[]
  selectedFile: number
  hasConflicts?: boolean
  prId?: string
  pr?: any
}

export function FileContent({ files, selectedFile, hasConflicts, prId, pr }: FileContentProps) {
  const [isResolving, setIsResolving] = useState(false)
  const [resolvedContent, setResolvedContent] = useState<string | null>(null)
  const [resolutionExplanation, setResolutionExplanation] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("conflicts")
  const { isDark } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAiResolve = async () => {
    if (!currentFile?.patch) return
    
    setIsResolving(true)
    
    try {
      const result = await resolveConflict(
        currentFile.patch,
        currentFile.filename
      )
      
      if (result.success && result.data) {
        setResolvedContent(result.data.resolvedContent)
        setResolutionExplanation(result.data.explanation)
        setConfidence(result.data.confidence)
        setActiveTab("resolved")
        toast.success("Conflicts resolved successfully!", {
          description: `Resolved conflicts in ${currentFile.filename} with ${Math.round((result.data.confidence || 0) * 100)}% confidence`
        })
      } else {
        console.error('Resolution failed:', result.error)
        toast.error('Failed to resolve conflicts', {
          description: result.error || 'Please try again.'
        })
      }
    } catch (error) {
      console.error('Resolution error:', error)
      toast.error('An error occurred while resolving conflicts', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    } finally {
      setIsResolving(false)
    }
  }

  const handleApplyToGithub = async () => {
    if (!resolvedContent || !currentFile?.filename || !prId) {
      alert("Missing required data to apply resolution")
      return
    }

    try {
      const result = await applyResolutionToGitHub(
        prId,
        currentFile.filename,
        resolvedContent,
        `AI: Resolve conflicts in ${currentFile.filename}`
      )

      if (result.success) {
        alert("Resolution applied to GitHub successfully!")
        // Reset the resolved content after successful application
        setResolvedContent(null)
        setResolutionExplanation(null)
        setConfidence(null)
        setActiveTab("conflicts")
      } else {
        alert(`Failed to apply resolution: ${result.error}`)
      }
    } catch (error) {
      console.error('Apply to GitHub error:', error)
      alert('An error occurred while applying the resolution.')
    }
  }

  const conflictedFiles = (files || []).filter(file => 
    file.hasConflict || file.status === 'modified' || file.status === 'added'
  )
  const currentFile = conflictedFiles[selectedFile]
  const syntaxTheme = mounted ? (isDark ? oneDark : oneLight) : oneLight



  return (
    <div className="lg:col-span-2">
      <div className="border rounded-lg">
        <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {currentFile?.filename.split('/').pop()}
          </h3>
          <Button 
            onClick={handleAiResolve}
            disabled={isResolving}
            size="sm"
            className="flex items-center gap-2"
          >
            <Bot className="h-3 w-3" />
            {isResolving ? "Resolving..." : "AI Resolve"}
          </Button>
        </div>
        <div className="p-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger 
                value="conflicts" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm cursor-pointer"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                File Content
              </TabsTrigger>
              <TabsTrigger 
                value="resolved" 
                disabled={!resolvedContent}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm cursor-pointer"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolved
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="conflicts" className="mt-3">
              {currentFile?.hasConflict && currentFile?.baseContent && currentFile?.headContent ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-t">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Base Branch ({pr?.base?.ref || 'main'})
                        </h4>
                      </div>
                      <div className="rounded-b border border-t-0 border-red-200 dark:border-red-800 overflow-hidden">
                        <SyntaxHighlighter
                          language={getLanguageFromFile(currentFile?.filename || '')}
                          style={syntaxTheme}
                          customStyle={{
                            margin: 0,
                            fontSize: '13px',
                            lineHeight: '1.4',
                          }}
                          showLineNumbers={true}
                          wrapLines={true}
                        >
                          {currentFile.baseContent}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    <div>
                      <div className="p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-t">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Head Branch ({pr?.head?.ref || 'feature'})
                        </h4>
                      </div>
                      <div className="rounded-b border border-t-0 border-blue-200 dark:border-blue-800 overflow-hidden">
                        <SyntaxHighlighter
                          language={getLanguageFromFile(currentFile?.filename || '')}
                          style={syntaxTheme}
                          customStyle={{
                            margin: 0,
                            fontSize: '13px',
                            lineHeight: '1.4',
                          }}
                          showLineNumbers={true}
                          wrapLines={true}
                        >
                          {currentFile.headContent}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded border overflow-hidden">
                  <SyntaxHighlighter
                    language={getLanguageFromFile(currentFile?.filename || '')}
                    style={syntaxTheme}
                    customStyle={{
                      margin: 0,
                      fontSize: '13px',
                      lineHeight: '1.4',
                    }}
                    showLineNumbers={true}
                    wrapLines={true}
                  >
                    {currentFile?.patch || '// No content available'}
                  </SyntaxHighlighter>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="resolved" className="mt-3">
              <div className="rounded border overflow-hidden">
                <SyntaxHighlighter
                  language={getLanguageFromFile(currentFile?.filename || '')}
                  style={syntaxTheme}
                  customStyle={{
                    margin: 0,
                    fontSize: '13px',
                    lineHeight: '1.4',
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {resolvedContent || ''}
                </SyntaxHighlighter>
              </div>
              {resolvedContent && (
                <div className="mt-3 space-y-3">
                  {resolutionExplanation && (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 px-4 py-3 border-b">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">AI Analysis</h4>
                        </div>
                      </div>
                      <div className="p-4 bg-background">
                        <p className="text-sm leading-relaxed text-foreground mb-4">{resolutionExplanation}</p>
                        {confidence && (
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-muted-foreground">Confidence</span>
                            <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  confidence >= 0.8 ? 'bg-green-500' : 
                                  confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold min-w-[3rem] text-right">
                              {Math.round(confidence * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={handleApplyToGithub} size="sm" className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Apply to GitHub
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      setResolvedContent(null)
                      setResolutionExplanation(null)
                      setConfidence(null)
                      setActiveTab("conflicts")
                    }}>
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
