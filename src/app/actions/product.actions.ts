"use server"

import { randomUUID } from "crypto"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database, ProductInsert } from "@/types/database.types"
import { createProduct, updateProduct, deleteProduct } from "@/lib/services/product.service"

async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    {
      cookies: cookieStore,
    }
  )
}

function serializeError(error: any): { message: string } {
  return {
    message: error?.message ?? "Erreur inconnue",
  }
}

export async function createProductAction(formData: FormData) {
  const supabase = await createSupabaseServer()
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    return { success: false, error: serializeError(sessionError).message }
  }

  const sellerId = session?.user?.id

  if (!sellerId) {
    return { success: false, error: "Utilisateur non authentifié." }
  }

  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const price = Number(formData.get("price"))
  const stock = Number(formData.get("stock"))
  const imageFile = formData.get("image") as File | null

  if (!name) {
    return { success: false, error: "Le nom du produit est requis." }
  }

  if (!Number.isFinite(price) || price < 0) {
    return { success: false, error: "Le prix doit être un montant valide." }
  }

  if (!Number.isFinite(stock) || stock < 0) {
    return { success: false, error: "Le stock doit être un nombre positif." }
  }

  let imageUrl: string | null = null

  if (imageFile && imageFile.size > 0) {
    const key = `${sellerId}/${randomUUID()}-${imageFile.name.replace(/\s+/g, "_")}`
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(key, imageFile, {
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      return { success: false, error: serializeError(uploadError).message }
    }

    const { data: publicData } = await supabase.storage
      .from("product-images")
      .getPublicUrl(key)

    imageUrl = publicData?.publicUrl ?? null
  }

  const payload = {
    name,
    description: description || null,
    price: Math.round(price),
    stock: Number.isFinite(stock) ? stock : 0,
    images: imageUrl ? [imageUrl] : null,
    is_active: true,
  }

  const { error: productError } = await createProduct(sellerId, payload)

  if (productError) {
    return { success: false, error: serializeError(productError).message }
  }

  return { success: true }
}

export async function toggleProductStatusAction(
  productId: string,
  isActive: boolean
) {
  const supabase = await createSupabaseServer()
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    return { success: false, error: serializeError(sessionError).message }
  }

  const sellerId = session?.user?.id

  if (!sellerId) {
    return { success: false, error: "Utilisateur non authentifié." }
  }

  const { error } = await updateProduct(productId, sellerId, {
    is_active: !isActive,
  })

  if (error) {
    return { success: false, error: serializeError(error).message }
  }

  return { success: true }
}

export async function deleteProductAction(productId: string) {
  const supabase = await createSupabaseServer()
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    return { success: false, error: serializeError(sessionError).message }
  }

  const sellerId = session?.user?.id

  if (!sellerId) {
    return { success: false, error: "Utilisateur non authentifié." }
  }

  const { error } = await deleteProduct(productId, sellerId)

  if (error) {
    return { success: false, error: serializeError(error).message }
  }

  return { success: true }
}
