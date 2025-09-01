// Mock data for dashboard conflicts
export const mockConflicts = [
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

// Mock data for PR details
export const mockPrData = {
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

// Mock resolved content for AI resolution
export const getMockResolvedContent = (file: string) => {
  if (file.includes('login.tsx')) {
    return `import React from 'react'
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
  } else if (file.includes('types.ts')) {
    return `export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  lastLogin?: Date
}`
  } else {
    // Fallback: just remove conflict markers
    return file
      .replace(/<<<<<<< HEAD\n/g, '')
      .replace(/=======\n/g, '')
      .replace(/>>>>>>> feature\/auth\n/g, '')
      .replace(/<<<<<<< HEAD/g, '')
      .replace(/=======/g, '')
      .replace(/>>>>>>> feature\/auth/g, '')
  }
}
