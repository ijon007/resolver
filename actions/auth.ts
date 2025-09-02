"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers";
import { redirect } from "next/navigation"

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return session;
}

export const signOut = async () => {
  await auth.api.signOut({
      headers: await headers(),
  });
  redirect("/");
}