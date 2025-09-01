"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Bot
} from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getLanguageFromFile } from "@/lib/utils"
import { mockPrData, getMockResolvedContent } from "@/constants/mockData"

interface FileContentProps {
  selectedFile: number
}

export function FileContent({ selectedFile }: FileContentProps) {
  const [isResolving, setIsResolving] = useState(false)
  const [resolvedContent, setResolvedContent] = useState<string | null>(null)

  const handleAiResolve = async () => {
    setIsResolving(true)
    
    // Mock AI resolution - will be replaced with real AI call
    setTimeout(() => {
      const currentFile = mockPrData.conflicts[selectedFile]
      const resolved = getMockResolvedContent(currentFile.content)
      setResolvedContent(resolved)
      setIsResolving(false)
    }, 2000)
  }

  const handleApplyToGithub = () => {
    // Mock apply to GitHub - will be replaced with real GitHub API call
    alert("Applied to GitHub! (This is a mock)")
  }

  const currentFile = mockPrData.conflicts[selectedFile]

  return (
    <div className="lg:col-span-2">
      <div className="border rounded-lg">
        <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {currentFile?.file.split('/').pop()}
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
          <Tabs defaultValue="conflicts" className="w-full">
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger 
                value="conflicts" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Conflicts
              </TabsTrigger>
              <TabsTrigger 
                value="resolved" 
                disabled={!resolvedContent}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Resolved
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="conflicts" className="mt-3">
              <div className="rounded border overflow-hidden">
                <SyntaxHighlighter
                  language={getLanguageFromFile(currentFile?.file || '')}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    fontSize: '13px',
                    lineHeight: '1.4',
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {currentFile?.content || ''}
                </SyntaxHighlighter>
              </div>
            </TabsContent>
            
            <TabsContent value="resolved" className="mt-3">
              <div className="rounded border overflow-hidden">
                <SyntaxHighlighter
                  language={getLanguageFromFile(currentFile?.file || '')}
                  style={vscDarkPlus}
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
                <div className="mt-3 flex gap-2">
                  <Button onClick={handleApplyToGithub} size="sm" className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3" />
                    Apply to GitHub
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setResolvedContent(null)}>
                    Reset
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
