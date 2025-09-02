"use server"

import { auth } from "@/lib/auth"
import { getSession } from "./auth"

export async function applyResolutionToGitHub(
  prId: string,
  filename: string,
  resolvedContent: string,
  commitMessage?: string
) {
  const session = await getSession()

  if (!session?.user.id) {
    throw new Error("Not authenticated")
  }

  const accessToken = await auth.api.getAccessToken({
    body: {
      providerId: "github",
      userId: session.user.id,
    },
  })
  
  if (!accessToken) {
    throw new Error("Not authenticated")
  }

  const [owner, repo, prNumber] = prId.split('/')
  if (!owner || !repo || !prNumber) {
    throw new Error("Invalid PR ID format")
  }

  try {
    // Get the PR to find the head branch
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
    const headBranch = pr.head.ref

    // Get the current file content from the head branch
    const fileResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filename}?ref=${headBranch}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status}`)
    }

    const fileData = await fileResponse.json()
    const currentSha = fileData.sha

    // Create a new commit with the resolved content
    const commitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage || `AI: Resolve conflicts in ${filename}`,
          content: Buffer.from(resolvedContent).toString('base64'),
          sha: currentSha,
          branch: headBranch,
        }),
      }
    )

    if (!commitResponse.ok) {
      const errorData = await commitResponse.json()
      throw new Error(`Failed to commit: ${commitResponse.status} - ${errorData.message}`)
    }

    const commitData = await commitResponse.json()

    return {
      success: true,
      commitSha: commitData.commit.sha,
      message: 'Resolution applied successfully'
    }
  } catch (error) {
    console.error('GitHub resolution error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
