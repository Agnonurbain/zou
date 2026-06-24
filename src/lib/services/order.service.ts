import type { PostgrestError } from "@supabase/supabase-js"
import type { OrderInsert, OrderUpdate, OrdersRow } from "@/types/database.types"
import { createSupabaseServer } from "@/lib/supabase/server"

export async function getSellerOrders(
  sellerId: string,
  status?: string
): Promise<{
  data: OrdersRow[] | null
  error: PostgrestError | null
}> {
  const supabase = await createSupabaseServer()
  const orders = supabase.from("orders" as const) as any
  let query = orders
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  return { data, error }
}

export async function createOrder(
  sellerId: string,
  data: OrderInsert
): Promise<{
  data: OrdersRow | null
  error: PostgrestError | null
}> {
  const supabase = await createSupabaseServer()
  const orders = supabase.from("orders" as const) as any
  const payload: OrderInsert = {
    ...data,
    seller_id: sellerId,
  }

  const { data: createdOrder, error } = await orders
    .insert(payload as unknown as any)
    .select()
    .single()

  return { data: createdOrder, error }
}

export async function updateOrderStatus(
  orderId: string,
  sellerId: string,
  status: string
): Promise<{
  data: OrdersRow | null
  error: PostgrestError | null
}> {
  const supabase = await createSupabaseServer()
  const orders = supabase.from("orders" as const) as any
  const { data: updatedOrder, error } = await orders
    .update({ status } as any)
    .eq("id", orderId)
    .eq("seller_id", sellerId)
    .select()
    .single()

  return { data: updatedOrder, error }
}
