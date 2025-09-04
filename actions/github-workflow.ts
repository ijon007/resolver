"use server"

import { auth } from "@/lib/auth"
import { getSession } from "./auth"

export async function triggerConflictResolutionWorkflow(
  owner: string,
  repo: string,
  prNumber: string,
  baseBranch: string,
  headBranch: string
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

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/ai-conflict-resolver.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: headBranch,
          inputs: {
            pr_number: prNumber,
            owner: owner,
            repo: repo,
            base_branch: baseBranch,
            head_branch: headBranch
          }
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to trigger workflow: ${response.status} - ${errorData}`)
    }

    return {
      success: true,
      message: 'Workflow triggered successfully'
    }
  } catch (error) {
    console.error('Workflow trigger error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function getWorkflowRuns(
  owner: string,
  repo: string,
  workflowId: string = 'ai-conflict-resolver.yml'
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

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs?per_page=10`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch workflow runs: ${response.status}`)
    }

    const data = await response.json()
    return data.workflow_runs || []
  } catch (error) {
    console.error('Workflow runs fetch error:', error)
    throw error
  }
}

export async function getWorkflowRunArtifacts(
  owner: string,
  repo: string,
  runId: string
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

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch artifacts: ${response.status}`)
    }

    const data = await response.json()
    return data.artifacts || []
  } catch (error) {
    console.error('Artifacts fetch error:', error)
    throw error
  }
}

export async function downloadArtifact(
  owner: string,
  repo: string,
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

  try {
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

    return response
  } catch (error) {
    console.error('Artifact download error:', error)
    throw error
  }
}
