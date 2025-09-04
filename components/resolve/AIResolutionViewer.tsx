"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, FileText, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResolvedFile {
  filename: string
  resolvedContent: string
  explanation: string
  confidence: number
}

interface AIResolutionViewerProps {
  resolvedFiles: ResolvedFile[]
  onAcceptAll: () => void
  onAcceptFile: (filename: string) => void
  isCommitting: boolean
}

export function AIResolutionViewer({ 
  resolvedFiles, 
  onAcceptAll, 
  onAcceptFile, 
  isCommitting 
}: AIResolutionViewerProps) {
  const [selectedFile, setSelectedFile] = useState(0)
  const [showContent, setShowContent] = useState<{ [key: string]: boolean }>({})

  const toggleContent = (filename: string) => {
    setShowContent(prev => ({
      ...prev,
      [filename]: !prev[filename]
    }))
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800"
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High"
    if (confidence >= 0.6) return "Medium"
    return "Low"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Resolutions</h3>
          <p className="text-sm text-muted-foreground">
            {resolvedFiles.length} files resolved by AI
          </p>
        </div>
        <Button 
          onClick={onAcceptAll}
          disabled={isCommitting}
          className="h-8"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Accept All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* File List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resolved Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {resolvedFiles.map((file, index) => (
                  <div
                    key={file.filename}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFile === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFile(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {file.filename}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge 
                          className={`text-xs ${getConfidenceColor(file.confidence)}`}
                        >
                          {getConfidenceLabel(file.confidence)}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onAcceptFile(file.filename)
                          }}
                          disabled={isCommitting}
                          className="h-6 w-6 p-0"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* File Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {resolvedFiles[selectedFile]?.filename}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  className={`text-xs ${getConfidenceColor(resolvedFiles[selectedFile]?.confidence || 0)}`}
                >
                  {getConfidenceLabel(resolvedFiles[selectedFile]?.confidence || 0)} Confidence
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleContent(resolvedFiles[selectedFile]?.filename || '')}
                  className="h-6 w-6 p-0"
                >
                  {showContent[resolvedFiles[selectedFile]?.filename || ''] ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {/* Explanation */}
                <div>
                  <h4 className="text-sm font-medium mb-2">AI Explanation:</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                    {resolvedFiles[selectedFile]?.explanation}
                  </p>
                </div>

                {/* Content Preview */}
                {showContent[resolvedFiles[selectedFile]?.filename || ''] && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Resolved Content:</h4>
                    <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                      {resolvedFiles[selectedFile]?.resolvedContent}
                    </pre>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
