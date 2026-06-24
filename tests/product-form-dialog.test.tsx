import "@testing-library/jest-dom"
import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ProductFormDialog } from "@/components/features/products/ProductFormDialog"

vi.mock("@/app/actions/product.actions", () => ({
  createProductAction: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}))

let createProductAction: vi.Mock

describe("ProductFormDialog", () => {
  beforeEach(async () => {
    vi.resetAllMocks()
    global.URL.createObjectURL = vi.fn(() => "blob://preview")
    global.URL.revokeObjectURL = vi.fn()

    const module = await import("@/app/actions/product.actions")
    createProductAction = module.createProductAction as vi.Mock
  })

  it("renders the dialog trigger and opens the product form", async () => {
    render(<ProductFormDialog />)

    expect(screen.getByRole("button", { name: /Nouveau Produit/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /Nouveau Produit/i }))

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Ajouter un produit/i })).toBeInTheDocument()
    })

    expect(screen.getByLabelText(/Nom du produit/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Prix/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Stock/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Image/i)).toBeInTheDocument()
  })

  it("shows validation errors when required fields are empty or invalid", async () => {
    render(<ProductFormDialog />)
    fireEvent.click(screen.getByRole("button", { name: /Nouveau Produit/i }))

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Ajouter un produit/i })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/Prix/i), { target: { value: "-10" } })
    fireEvent.click(screen.getByRole("button", { name: /Créer le produit/i }))

    await waitFor(() => {
      expect(screen.getByText(/Le nom du produit est requis/i)).toBeVisible()
      expect(screen.getByText(/Le prix doit être au moins 0/i)).toBeVisible()
    })
  })

  it("submits the form with image upload and resets on success", async () => {
    ;(createProductAction as vi.Mock).mockResolvedValue({ success: true })

    render(<ProductFormDialog />)
    fireEvent.click(screen.getByRole("button", { name: /Nouveau Produit/i }))

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Ajouter un produit/i })).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/Nom du produit/i), { target: { value: "T-shirt Zou" } })
    fireEvent.change(screen.getByLabelText(/Prix/i), { target: { value: "5000" } })
    fireEvent.change(screen.getByLabelText(/Stock/i), { target: { value: "10" } })

    const file = new File(["dummy content"], "image.png", { type: "image/png" })
    fireEvent.change(screen.getByLabelText(/Image/i), {
      target: { files: [file] },
    })

    fireEvent.click(screen.getByRole("button", { name: /Créer le produit/i }))

    await waitFor(() => {
      expect(createProductAction).toHaveBeenCalled()
      expect(screen.queryByText(/Une erreur est survenue/i)).not.toBeInTheDocument()
    })
  })
})
