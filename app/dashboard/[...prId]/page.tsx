"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Bot,
  GitBranchIcon
} from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Mock data for MVP - will be replaced with real GitHub API calls
const mockPrData = {
  title: "Add user authentication system",
  number: 42,
  fromBranch: "feature/auth",
  toBranch: "main",
  status: "open", // open, merged, closed
  hasConflicts: true,
  repo: "myorg/myapp",
  author: "john-doe",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T14:45:00Z",
  commits: 8,
  additions: 156,
  deletions: 23,
  conflicts: [
    {
      file: "src/auth/login.tsx",
      conflicts: 2,
      content: `import React from 'react'
import { useState } from 'react'

<<<<<<< HEAD
const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
=======
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
>>>>>>> feature/auth

  return (
    <form>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
<<<<<<< HEAD
      <button type="submit">Login</button>
=======
      <label>
        <input 
          type="checkbox" 
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>
      <button type="submit">Login</button>
>>>>>>> feature/auth
    </form>
  )
}

export default LoginForm`
    },
    {
      file: "src/auth/types.ts",
      conflicts: 1,
      content: `export interface User {
  id: string
  email: string
<<<<<<< HEAD
  name: string
=======
  name: string
  avatar?: string
  lastLogin?: Date
>>>>>>> feature/auth
}`
    }
  ]
}

export default function ResolvePage() {
  const params = useParams()
  const prId = params.prId as string
  const [selectedFile, setSelectedFile] = useState(0)
  const [isResolving, setIsResolving] = useState(false)
  const [resolvedContent, setResolvedContent] = useState<string | null>(null)

  // Helper function to detect language from file extension
  const getLanguageFromFile = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'typescript'
      case 'jsx':
      case 'js':
        return 'javascript'
      case 'py':
        return 'python'
      case 'java':
        return 'java'
      case 'cpp':
      return 'cpp'
      case 'c':
        return 'c'
      case 'cs':
        return 'csharp'
      case 'php':
        return 'php'
      case 'rb':
        return 'ruby'
      case 'go':
        return 'go'
      case 'rs':
        return 'rust'
      case 'css':
        return 'css'
      case 'scss':
        return 'scss'
      case 'html':
        return 'html'
      case 'json':
        return 'json'
      case 'yaml':
      case 'yml':
        return 'yaml'
      case 'md':
        return 'markdown'
      default:
        return 'text'
    }
  }

  const handleAiResolve = async () => {
    setIsResolving(true)
    
    // Mock AI resolution - will be replaced with real AI call
    setTimeout(() => {
      const currentFile = mockPrData.conflicts[selectedFile]
      
      // Properly merge the conflicts instead of just removing markers
      let resolved = currentFile.content
      
      if (currentFile.file.includes('login.tsx')) {
        // Smart merge for login.tsx - combine both versions properly
        resolved = `import React from 'react'
import { useState } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <form>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <label>
        <input 
          type="checkbox" 
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm`
      } else if (currentFile.file.includes('types.ts')) {
        // Smart merge for types.ts - combine both interfaces
        resolved = `export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  lastLogin?: Date
}`
      } else {
        // Fallback: just remove conflict markers
        resolved = currentFile.content
          .replace(/<<<<<<< HEAD\n/g, '')
          .replace(/=======\n/g, '')
          .replace(/>>>>>>> feature\/auth\n/g, '')
          .replace(/<<<<<<< HEAD/g, '')
          .replace(/=======/g, '')
          .replace(/>>>>>>> feature\/auth/g, '')
      }
      
      setResolvedContent(resolved)
      setIsResolving(false)
    }, 2000)
  }

  const handleApplyToGithub = () => {
    // Mock apply to GitHub - will be replaced with real GitHub API call
    alert("Applied to GitHub! (This is a mock)")
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitBranchIcon className="h-5 w-5" />
            <h1 className="text-xl font-semibold">{mockPrData.title}</h1>
            <Badge variant="secondary">#{mockPrData.number}</Badge>
          </div>
        </div>
      </div>

      {/* PR Info */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Badge 
            variant={mockPrData.status === "open" ? "default" : mockPrData.status === "merged" ? "secondary" : "destructive"}
            className={`text-sm ${
              mockPrData.status === "open" 
                ? "bg-green-100 text-green-800 border-green-200" 
                : mockPrData.status === "merged" 
                ? "bg-purple-100 text-purple-800 border-purple-200"
                : ""
            }`}
          >
            {mockPrData.status === "open" ? "Open" : mockPrData.status === "merged" ? "Merged" : "Closed"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold">{mockPrData.author}</span> wants to merge 1 commit into{" "}
            <span className="font-medium font-mono border border-border bg-muted px-1 rounded-md">{mockPrData.toBranch}</span> from{" "}
            <span className="font-medium font-mono border border-border bg-muted px-1 rounded-md">{mockPrData.fromBranch}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-green-600 font-medium">
            +{mockPrData.additions}
          </span>
          <span className="flex items-center gap-1 text-red-600 font-medium">
            -{mockPrData.deletions}
          </span>
          <span className="text-muted-foreground">
            {mockPrData.conflicts.length} files with conflicts
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conflicts List */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg">
            <div className="p-3 border-b bg-muted/30">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Conflicted Files
              </h3>
            </div>
            <div className="p-2">
              <div className="space-y-1">
                {mockPrData.conflicts.map((conflict, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedFile === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-transparent hover:border-gray-200 hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedFile(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">
                        {conflict.file.split('/').pop()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {conflict.conflicts}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {conflict.file}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* File Content */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg">
            <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {mockPrData.conflicts[selectedFile]?.file.split('/').pop()}
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
                      language={getLanguageFromFile(mockPrData.conflicts[selectedFile]?.file || '')}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        fontSize: '13px',
                        lineHeight: '1.4',
                      }}
                      showLineNumbers={true}
                      wrapLines={true}
                    >
                      {mockPrData.conflicts[selectedFile]?.content || ''}
                    </SyntaxHighlighter>
                  </div>
                </TabsContent>
                
                <TabsContent value="resolved" className="mt-3">
                  <div className="rounded border overflow-hidden">
                    <SyntaxHighlighter
                      language={getLanguageFromFile(mockPrData.conflicts[selectedFile]?.file || '')}
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
      </div>
    </div>
  )
}
