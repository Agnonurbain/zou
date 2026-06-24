import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, Settings, Menu } from "lucide-react"
import { signOut } from "@/app/actions/auth.actions"
import { Button } from "@/components/ui/button"

const navLinks = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    Icon: LayoutDashboard,
  },
  {
    href: "/dashboard/products",
    label: "Produits",
    Icon: Package,
  },
  {
    href: "/dashboard/orders",
    label: "Commandes",
    Icon: ShoppingBag,
  },
  {
    href: "/dashboard",
    label: "Paramètres",
    Icon: Settings,
  },
]

function NavItem({ href, label, Icon }: { href: string; label: string; Icon: typeof LayoutDashboard }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <Icon className="h-5 w-5 text-slate-500" />
      {label}
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
            Zou
          </Link>
          <details className="relative">
            <summary className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
              <Menu className="h-5 w-5" />
              Menu
            </summary>
            <div className="absolute right-0 z-20 mt-2 min-w-[18rem] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <NavItem key={link.href} {...link} />
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>

      <div className="md:flex">
        <aside className="hidden w-80 shrink-0 border-r border-slate-200 bg-white px-6 py-8 md:block">
          <div className="mb-10">
            <Link href="/dashboard" className="text-2xl font-semibold text-slate-950">
              Zou
            </Link>
            <p className="mt-2 text-sm text-slate-500">Espace vendeur</p>
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <NavItem key={link.href} {...link} />
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Boutique</p>
                <h1 className="text-2xl font-semibold text-slate-950">Boutique Zou</h1>
              </div>
              <div className="flex items-center gap-3">
                <form action={signOut}>
                  <Button type="submit" variant="outline">
                    Déconnexion
                  </Button>
                </form>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
