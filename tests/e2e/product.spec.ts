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

  await page.fill('input#name', 'E2E produit')
  await page.fill('input#price', '2500')
  await page.fill('input#stock', '5')

  const filePath = path.resolve(__dirname, 'fixtures', 'product.png')
  const fileInput = await page.$('input#image')
  if (fileInput) await fileInput.setInputFiles(filePath)

  // Click submit and wait for the POST request triggered by the server action
  const submitRequestPromise = page.waitForRequest((req) => req.method() === 'POST', { timeout: 15000 })
  await page.click('text=Créer le produit')
  await submitRequestPromise

  // Wait for form to be reset (name input cleared) as indication of success
  await page.waitForFunction(() => {
    const el = document.querySelector('input#name') as HTMLInputElement | null
    return el ? el.value === '' : false
  }, { timeout: 15000 })
})
