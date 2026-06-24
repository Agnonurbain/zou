import type { PostgrestError } from "@supabase/supabase-js"
import type { ProductInsert, ProductUpdate, ProductsRow } from "@/types/database.types"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function getSellerProducts(sellerId: string): Promise<{
  data: ProductsRow[] | null
  error: PostgrestError | null
}> {
  const supabase = await createSupabaseServer()
  const products = supabase.from("products" as const) as any
  const { data, error } = await products
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })

  return { data, error }
}

export async function createProduct(
  sellerId: string,
  data: Omit<ProductInsert, "seller_id">
): Promise<{
  data: ProductsRow | null
  error: PostgrestError | null
}> {
  const supabase = await createSupabaseServer()
  const products = supabase.from("products" as const) as any
  const payload: ProductInsert = {
    ...data,
    seller_id: sellerId,
  }

  const { data: createdProduct, error } = await products
    .insert(payload)
    .select()
    .single()

  return { data: createdProduct, error }
}

export async function updateProduct(
  productId: string,
  sellerId: string,
  data: ProductUpdate
): Promise<{
  data: ProductsRow | null
  error: PostgrestError | null
}> {
  const supabase = await createSupabaseServer()
  const products = supabase.from("products" as const) as any
  const { data: updatedProduct, error } = await products
    .update(data)
    .eq("id", productId)
    .eq("seller_id", sellerId)
    .select()
    .single()

  return { data: updatedProduct, error }
}

export async function deleteProduct(
  productId: string,
  sellerId: string
): Promise<{
  data: ProductsRow | null
  error: PostgrestError | null
}> {
  const supabase = await createSupabaseServer()
  const products = supabase.from("products" as const) as any
  const { data: deletedProduct, error } = await products
    .delete()
    .eq("id", productId)
    .eq("seller_id", sellerId)
    .select()
    .single()

  return { data: deletedProduct, error }
}
