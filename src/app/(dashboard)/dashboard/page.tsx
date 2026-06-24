import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-500">Bonjour vendeur</p>
          <h1 className="text-3xl font-semibold text-slate-950">Bienvenue sur Zou</h1>
          <p className="max-w-2xl text-slate-600">
            Ton espace vendeur est prêt. Accède à tes produits, commandes et paramètres depuis la barre de navigation.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Ventes aujourd’hui", value: "120" },
          { title: "Produits actifs", value: "34" },
          { title: "Commandes en attente", value: "8" },
        ].map((stat) => (
          <Card key={stat.title} className="rounded-3xl border border-slate-200 bg-white p-6">
            <CardHeader>
              <CardTitle className="text-base font-medium text-slate-500">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
