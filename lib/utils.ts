import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to detect language from file extension
export const getLanguageFromFile = (filename: string) => {
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

// Extract PR ID from GitHub URL
export const extractPrId = (url: string) => {
  // Extract repo and PR number from GitHub URL
  // Example: https://github.com/owner/repo/pull/123 -> owner/repo/123
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/)
  if (match) {
    return `${match[1]}/${match[2]}/${match[3]}`
  }
  return null
}

// Status utility functions

export const getStatusText = (status: string) => {
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

export const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "text-green-600"
    case "resolved":
      return "text-green-600"
    case "merged":
      return "text-purple-600"
    case "closed":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}