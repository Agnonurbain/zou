"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit3, Trash2, CheckCircle2, Slash } from "lucide-react"
import { deleteProductAction, toggleProductStatusAction } from "@/app/actions/product.actions"

interface ProductActionsMenuProps {
  productId: string
  isActive: boolean
}

export function ProductActionsMenu({ productId, isActive }: ProductActionsMenuProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  async function handleToggleStatus() {
    setIsProcessing(true)
    const result = await toggleProductStatusAction(productId, isActive)
    setIsProcessing(false)

    if (!result.success) {
      window.alert(result.error ?? "Impossible de mettre à jour le produit.")
      return
    }

    router.refresh()
  }

  async function handleDelete() {
    const confirmed = window.confirm("Supprimer ce produit ? Cette action est irréversible.")
    if (!confirmed) {
      return
    }

    setIsProcessing(true)
    const result = await deleteProductAction(productId)
    setIsProcessing(false)

    if (!result.success) {
      window.alert(result.error ?? "Impossible de supprimer le produit.")
      return
    }

    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" className="w-44">
        <DropdownMenuItem onSelect={() => window.alert("Modification de produit à venir.") }>
          <Edit3 className="mr-2 h-4 w-4" /> Modifier
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleToggleStatus}>
          {isActive ? (
            <Slash className="mr-2 h-4 w-4" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          {isActive ? "Désactiver" : "Activer"}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
