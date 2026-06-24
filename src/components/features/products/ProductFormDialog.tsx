"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createProductAction } from "@/app/actions/product.actions"
import { ImagePlus, ImageIcon } from "lucide-react"

const productFormSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis."),
  description: z.string().optional(),
  price: z.number().min(0, "Le prix doit être au moins 0."),
  stock: z.number().min(0, "Le stock doit être au moins 0.").optional(),
  image: z.any().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function ProductFormDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      image: undefined,
    },
  })

  const watchedImage = watch("image") as FileList | undefined

  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0]
      const objectUrl = URL.createObjectURL(file)
      setPreviewSrc(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }

    setPreviewSrc(null)
  }, [watchedImage])

  async function onSubmit(values: ProductFormValues) {
    setServerError(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("description", values.description ?? "")
      formData.append("price", String(values.price))
      formData.append("stock", String(values.stock ?? 0))

      if (watchedImage && watchedImage.length > 0) {
        formData.append("image", watchedImage[0])
      }

      const result = await createProductAction(formData)

      if (!result.success) {
        setServerError(result.error ?? "Impossible de créer le produit.")
      } else {
        reset()
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
      setServerError("Une erreur est survenue lors de l'ajout du produit.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="fixed bottom-4 right-4 z-40 md:static md:flex md:justify-end">
        <DialogTrigger className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 md:rounded-md">
          <ImagePlus className="h-4 w-4" />
          Nouveau Produit
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Crée un produit visible dans ton catalogue avec une image et un stock.
          </DialogDescription>
        </DialogHeader>

        <form id="product-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom du produit</Label>
              <Input id="name" {...register("name")} placeholder="Ex : T-shirt Zou" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className="min-h-[120px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                placeholder="Décris ton produit en quelques mots"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="grid gap-2">
                <Label htmlFor="price">Prix (FCFA)</Label>
                <Input
                  id="price"
                  type="number"
                  step="100"
                  min="0"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="5000"
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register("stock", { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-500">
                  {previewSrc ? (
                    <img src={previewSrc} alt="Aperçu du produit" className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5" />
                  )}
                </div>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="h-auto min-h-[48px] w-full border-none bg-transparent px-0 py-0 text-sm text-slate-950"
                  {...register("image")}
                />
              </div>
            </div>
          </div>

          {serverError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <DialogFooter className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <DialogClose className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Annuler
            </DialogClose>
            <Button type="submit" form="product-form" disabled={isLoading} className="min-w-[160px]">
              {isLoading ? "Enregistrement..." : "Créer le produit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
