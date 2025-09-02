"use server"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"


export async function signOut() {
  await auth.api.signOut({
    headers: {
      cookie: ""
    }
  })
  redirect("/")
}
