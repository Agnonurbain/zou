import { test, expect } from '@playwright/test'
import path from 'path'

test('create product via dialog (mocked upload)', async ({ page, baseURL }) => {
  // Intercept fetch calls and return a fake success for POST requests
  await page.addInitScript(() => {
    // eslint-disable-next-line no-extend-native
    const _fetch = window.fetch
    // @ts-ignore
    window.fetch = async (input, init) => {
      try {
        const method = init?.method ?? (typeof input === 'string' ? 'GET' : undefined)
        if (method === 'POST') {
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      } catch (e) {
        // fallthrough
      }
      return _fetch(input, init)
    }
  })

  // Use the dev-only test route which does not require auth
  await page.goto(`${baseURL}/test/e2e/products`, { waitUntil: 'networkidle' })

  // Wait for the trigger to appear (allow extra time for dev server)
  await page.waitForSelector('text=Nouveau Produit', { timeout: 15000 })
  await page.click('text=Nouveau Produit')

  await page.fill('label:has-text("Nom du produit") >> input', 'E2E produit')
  await page.fill('label:has-text("Prix (FCFA)") >> input', '2500')
  await page.fill('label:has-text("Stock") >> input', '5')

  const filePath = path.resolve(__dirname, 'fixtures', 'product.png')
  const fileInput = await page.$('input[type="file"]')
  if (fileInput) await fileInput.setInputFiles(filePath)

  await page.click('text=Créer le produit')

  // Wait for dialog to close (title no longer visible)
  await expect(page.locator('text=Ajouter un produit')).toHaveCount(0)
})
