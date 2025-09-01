"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function signInWithGitHub() {
  const url = await auth.api.signInSocial({
    body: {
      provider: "github",
      callbackURL: "/dashboard"
    }
  })
  
  if (url) {
    redirect(url)
  }
}

export async function signOut() {
  await auth.api.signOut({
    headers: {
      cookie: ""
    }
  })
  redirect("/")
}
