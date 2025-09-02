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
  console.log("PR data:", data)
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
