import { test, expect } from '@playwright/test'
import path from 'path'

test('create product via dialog (mocked upload)', async ({ page, baseURL }) => {
  // Provide a global E2E mock for createProduct to bypass server action and Supabase
  await page.addInitScript(() => {
    // @ts-ignore
    window.__e2eCreateProduct = async (formData) => {
      return { success: true }
    }
  })

  // Use the dev-only test route which does not require auth
  await page.goto(`${baseURL}/test/e2e/products`, { waitUntil: 'networkidle' })

  // Wait for the trigger to appear (allow extra time for dev server)
  await page.waitForSelector('text=Nouveau Produit', { timeout: 15000 })
  await page.click('text=Nouveau Produit')

  await page.fill('input#name', 'E2E produit')
  await page.fill('input#price', '2500')
  await page.fill('input#stock', '5')

  const filePath = path.resolve(__dirname, 'fixtures', 'product.png')
  const fileInput = await page.$('input#image')
  if (fileInput) await fileInput.setInputFiles(filePath)

  await page.click('text=Créer le produit')

  // Wait for form to be reset (name input cleared) as indication of success
  await page.waitForFunction(() => {
    const el = document.querySelector('input#name') as HTMLInputElement | null
    return el ? el.value === '' : false
  }, { timeout: 15000 })
})
