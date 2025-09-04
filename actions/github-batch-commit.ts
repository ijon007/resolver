"use server"

import { auth } from "@/lib/auth"
import { getSession } from "./auth"

interface ResolvedFile {
  filename: string
  resolvedContent: string
  explanation?: string
  confidence?: number
}

export async function batchCommitResolutions(
  prId: string,
  resolvedFiles: ResolvedFile[],
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

    // Get the current tree SHA for the head branch
    const branchResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${headBranch}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!branchResponse.ok) {
      throw new Error(`Failed to fetch branch: ${branchResponse.status}`)
    }

    const branchData = await branchResponse.json()
    const baseTreeSha = branchData.object.sha

    // Get the current commit to use as parent
    const commitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits/${baseTreeSha}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!commitResponse.ok) {
      throw new Error(`Failed to fetch commit: ${commitResponse.status}`)
    }

    const commitData = await commitResponse.json()
    const parentSha = commitData.sha

    // Create blobs for each resolved file
    const blobs = []
    for (const file of resolvedFiles) {
      const blobResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken.accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: Buffer.from(file.resolvedContent).toString('base64'),
            encoding: 'base64'
          })
        }
      )

      if (!blobResponse.ok) {
        throw new Error(`Failed to create blob for ${file.filename}: ${blobResponse.status}`)
      }

      const blobData = await blobResponse.json()
      blobs.push({
        path: file.filename,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha
      })
    }

    // Create a new tree with the resolved files
    const treeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: blobs
        })
      }
    )

    if (!treeResponse.ok) {
      throw new Error(`Failed to create tree: ${treeResponse.status}`)
    }

    const treeData = await treeResponse.json()

    // Create a new commit
    const newCommitResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/commits`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage || `AI: Resolve merge conflicts in ${resolvedFiles.length} files`,
          tree: treeData.sha,
          parents: [parentSha]
        })
      }
    )

    if (!newCommitResponse.ok) {
      throw new Error(`Failed to create commit: ${newCommitResponse.status}`)
    }

    const newCommitData = await newCommitResponse.json()

    // Update the branch reference
    const updateRefResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${headBranch}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: newCommitData.sha
        })
      }
    )

    if (!updateRefResponse.ok) {
      throw new Error(`Failed to update branch: ${updateRefResponse.status}`)
    }

    return {
      success: true,
      commitSha: newCommitData.sha,
      message: `Successfully resolved conflicts in ${resolvedFiles.length} files`,
      filesResolved: resolvedFiles.length
    }
  } catch (error) {
    console.error('Batch commit error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function downloadAndParseArtifact(
  prId: string,
  artifactId: string
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

  const [owner, repo] = prId.split('/')
  if (!owner || !repo) {
    throw new Error("Invalid PR ID format")
  }

  try {
    // Download the artifact
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${artifactId}/zip`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to download artifact: ${response.status}`)
    }

    // Parse the ZIP file and extract resolved_files.json
    const arrayBuffer = await response.arrayBuffer()
    const zip = new (await import('jszip')).default()
    const zipData = await zip.loadAsync(arrayBuffer)
    
    // Look for resolved_files.json
    const resolvedFilesJson = zipData.file('resolved_files.json')
    if (!resolvedFilesJson) {
      throw new Error('resolved_files.json not found in artifact')
    }

    const jsonContent = await resolvedFilesJson.async('text')
    const resolvedFiles = JSON.parse(jsonContent)

    return {
      success: true,
      resolvedFiles: resolvedFiles
    }
  } catch (error) {
    console.error('Artifact download error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
