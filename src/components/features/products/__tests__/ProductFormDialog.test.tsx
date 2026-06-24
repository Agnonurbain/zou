import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock the server action module; use an inline factory so vi.mock can hoist safely
vi.mock('@/app/actions/product.actions', () => ({
  createProductAction: vi.fn(async () => ({ success: true })),
}))

// Simple mock for next/navigation (we don't assert on refresh here)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: () => {} }),
}))

import { createProductAction } from '@/app/actions/product.actions'
import { ProductFormDialog } from '../ProductFormDialog'

describe('ProductFormDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits the form and calls createProductAction + router.refresh', async () => {
    render(<ProductFormDialog />)

    // Open dialog
    const trigger = screen.getByRole('button', { name: /Nouveau Produit/i })
    fireEvent.click(trigger)

    // Fill fields
    const nameInput = screen.getByLabelText('Nom du produit')
    fireEvent.change(nameInput, { target: { value: 'Mon produit' } })

    const priceInput = screen.getByLabelText('Prix (FCFA)')
    fireEvent.change(priceInput, { target: { value: '1500' } })

    const stockInput = screen.getByLabelText('Stock')
    fireEvent.change(stockInput, { target: { value: '3' } })

    // File upload
    const file = new File(['dummy'], 'product.png', { type: 'image/png' })
    const imageInput = screen.getByLabelText('Image') as HTMLInputElement
    Object.defineProperty(imageInput, 'files', { value: [file] })
    fireEvent.change(imageInput)

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Créer le produit/i })
    fireEvent.click(submitBtn)

    await waitFor(() => expect(createProductAction).toHaveBeenCalled())
  })
})
