"use server"

import { auth } from "@/lib/auth"
import { getSession } from "./auth"

export async function fetchPR(prId: string) {
  const session = await getSession();

  if (!session?.user.id) {
    throw new Error("Not authenticated")
  }

  const accessToken = await auth.api.getAccessToken({
    body: {
      providerId: "github",
      userId: session.user.id,
    },
  });
  
  if (!accessToken) {
    throw new Error("Not authenticated")
  }

  const [owner, repo, prNumber] = prId.split('/')
  if (!owner || !repo || !prNumber) {
    throw new Error("Invalid PR ID format")
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch PR: ${response.status}`)
  }

  const data = await response.json()
  return data
}

export async function fetchPRFiles(prId: string) {
  const session = await getSession();

  if (!session?.user.id) {
    throw new Error("Not authenticated")
  }

  const accessToken = await auth.api.getAccessToken({
    body: {
      providerId: "github",
      userId: session.user.id,
    },
  });
  
  if (!accessToken) {
    throw new Error("Not authenticated")
  }

  const [owner, repo, prNumber] = prId.split('/')
  if (!owner || !repo || !prNumber) {
    throw new Error("Invalid PR ID format")
  }

  // First, get the PR details to check mergeability and get branch info
  const prResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  )

  if (!prResponse.ok) {
    throw new Error(`Failed to fetch PR: ${prResponse.status}`)
  }

  const pr = await prResponse.json()
  
  // Check if there's a recent workflow run with conflict resolution
  const workflowRuns = await getRecentWorkflowRuns(owner, repo, accessToken.accessToken)
  const latestRun = workflowRuns.find((run: any) => 
    run.status === 'completed' && 
    run.conclusion === 'success' &&
    run.inputs?.pr_number === prNumber
  )

  if (latestRun) {
    // Try to get resolved files from the latest workflow run
    try {
      const artifacts = await getWorkflowRunArtifacts(owner, repo, latestRun.id, accessToken.accessToken)
      const resolvedArtifact = artifacts.find((artifact: any) => artifact.name === 'resolved-conflicts')
      
      if (resolvedArtifact) {
        return {
          files: [],
          hasConflicts: true,
          workflowRun: latestRun,
          hasResolutions: true,
          artifacts: artifacts
        }
      }
    } catch (error) {
      console.warn('Failed to fetch workflow artifacts:', error)
    }
  }

  // If PR is not mergeable, we need to detect conflicts
  if (pr.mergeable === false) {
    return await detectMergeConflicts(owner, repo, pr, accessToken.accessToken)
  }

  // If mergeable, use the standard files endpoint
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch PR files: ${response.status}`)
  }

  return response.json()
}

async function detectMergeConflicts(owner: string, repo: string, pr: any, accessToken: string) {
  try {
    // Use the compare API to get the differences between base and head
    const compareResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/compare/${pr.base.ref}...${pr.head.ref}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!compareResponse.ok) {
      throw new Error(`Failed to compare branches: ${compareResponse.status}`)
    }

    const compareData = await compareResponse.json()
    
    // Get file contents from both branches to detect conflicts
    const conflictedFiles = []
    
    for (const file of compareData.files || []) {
      if (file.status === 'modified' || file.status === 'added') {
        try {
          // Get file content from base branch
          const baseContent = await getFileContent(owner, repo, file.filename, pr.base.sha, accessToken)
          
          // Get file content from head branch  
          const headContent = await getFileContent(owner, repo, file.filename, pr.head.sha, accessToken)
          
          // Check if there are actual conflicts by comparing the content
          if (baseContent && headContent && baseContent !== headContent) {
            conflictedFiles.push({
              ...file,
              baseContent,
              headContent,
              hasConflict: true
            })
          }
        } catch (error) {
          console.warn(`Failed to get content for ${file.filename}:`, error)
          // Still include the file but mark as potential conflict
          conflictedFiles.push({
            ...file,
            hasConflict: true
          })
        }
      }
    }

    return {
      files: conflictedFiles,
      hasConflicts: conflictedFiles.length > 0
    }
  } catch (error) {
    console.error('Error detecting merge conflicts:', error)
    // Fallback to basic file list
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/files`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )
    
    if (response.ok) {
      const files = await response.json()
      return {
        files: files.map((file: any) => ({ ...file, hasConflict: true })),
        hasConflicts: files.length > 0
      }
    }
    
    throw error
  }
}

async function getFileContent(owner: string, repo: string, filename: string, ref: string, accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${ref}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return Buffer.from(data.content, 'base64').toString('utf-8')
  } catch (error) {
    return null
  }
}

export async function fetchUserPRs() {
  const session = await getSession();

  if (!session?.user.id) {
    throw new Error("Not authenticated")
  }

  const accessToken = await auth.api.getAccessToken({
    body: {
      providerId: "github",
      userId: session.user.id,
    },
  });
  
  if (!accessToken) {
    throw new Error("Not authenticated")
  }

  const response = await fetch(
    `https://api.github.com/search/issues?q=author:${session.user.name}+type:pr+state:open&sort=updated&order=desc&per_page=6`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken.accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch user PRs: ${response.status}`)
  }

  const data = await response.json()
  return data.items || []
}

async function getRecentWorkflowRuns(owner: string, repo: string, accessToken: string) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/ai-conflict-resolver.yml/runs?per_page=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.workflow_runs || []
  } catch (error) {
    console.error('Failed to fetch workflow runs:', error)
    return []
  }
}

async function getWorkflowRunArtifacts(owner: string, repo: string, runId: string, accessToken: string) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.artifacts || []
  } catch (error) {
    console.error('Failed to fetch artifacts:', error)
    return []
  }
}
