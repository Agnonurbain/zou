import React from 'react'
import { ProductFormDialog } from '@/components/features/products/ProductFormDialog'
import { ProductActionsMenu } from '@/components/features/products/ProductActionsMenu'
import { Badge } from '@/components/ui/badge'
import { ImageIcon } from 'lucide-react'

export default function TestProductsPage() {
  if (process.env.NODE_ENV !== 'development') {
    // Only available in development for E2E testing
    return null
  }

  const products: any[] = []

  return (
    <div className="space-y-6 relative pb-28">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">Catalogue produits (E2E)</h1>
            <p className="mt-3 text-slate-600 max-w-2xl">Page de test E2E pour les produits.</p>
          </div>
          <div className="md:self-start">
            <ProductFormDialog />
          </div>
        </div>
      </section>

      {products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product: any) => (
            <article key={product.id} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="relative overflow-hidden bg-slate-950">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="h-52 w-full object-cover" />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-slate-100 text-slate-400">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{product.name}</h2>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{product.description ?? 'Aucune description'}</p>
                  </div>
                  <ProductActionsMenu productId={product.id} isActive={product.is_active} />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="font-medium text-slate-950">{product.price?.toLocaleString?.('fr-FR')} FCFA</span>
                  <span className="text-slate-500">•</span>
                  <span>{product.stock} en stock</span>
                </div>
                <Badge variant={product.is_active ? 'default' : 'destructive'}>{product.is_active ? 'Actif' : 'Inactif'}</Badge>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-xl font-semibold text-slate-950">Aucun produit pour le moment</p>
          <p className="mt-3 text-slate-600">Ajoute ton premier produit en cliquant sur le bouton « Nouveau Produit ».</p>
        </section>
      )}
    </div>
  )
}
