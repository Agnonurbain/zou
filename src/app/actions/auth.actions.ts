"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Database } from "@/types/database.types"

async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { cookies: cookieStore }
  )
}

function serializeError(error: any): { message: string; code?: string } | null {
  if (!error) return null
  return {
    message: error.message || "Erreur inconnue",
    code: error.code,
  }
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error: serializeError(error) }
}

export async function signUp(
  email: string,
  password: string,
  businessName: string,
  phoneNumber: string
) {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: serializeError(error) }
  }

  const user = data.user

  if (!user) {
    return { error: { message: "Impossible de créer le compte utilisateur." } }
  }

  const profileData: Database["public"]["Tables"]["profiles"]["Insert"] = {
    id: user.id,
    business_name: businessName,
    phone_number: phoneNumber,
  }

  const { error: profileError } = await (supabase.from("profiles") as any).insert(profileData)

  if (profileError) {
    return { error: serializeError(profileError) }
  }

  return { error: null }
}

export async function signOut() {
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  redirect("/login")
}
