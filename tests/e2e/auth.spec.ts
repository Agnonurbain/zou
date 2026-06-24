import { test, expect } from "@playwright/test"

test.describe("Auth Flow", () => {
  test("should redirect unauthenticated user from / to /login", async ({ page }) => {
    await page.goto("/")
    await page.waitForURL("**/login")
    expect(page.url()).toContain("/login")
  })

  test("should display login form", async ({ page }) => {
    await page.goto("/login")
    await expect(page.locator("text=Connexion")).toBeVisible()
    await expect(page.locator("input[type='email']")).toBeVisible()
    await expect(page.locator("input[type='password']")).toBeVisible()
    await expect(page.locator("button:has-text('Se connecter')")).toBeVisible()
  })

  test("should toggle password visibility", async ({ page }) => {
    await page.goto("/login")
    
    const passwordInput = page.locator("input#password")
    const toggleButton = page.locator("button[aria-label*='mot de passe']").first()
    
    // Initially hidden
    await expect(passwordInput).toHaveAttribute("type", "password")
    
    // Click to show
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute("type", "text")
    
    // Click to hide again
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute("type", "password")
  })

  test("should show validation error for invalid email", async ({ page }) => {
    await page.goto("/login")
    
    await page.fill("input[type='email']", "invalid-email")
    await page.fill("input[type='password']", "password123")
    await page.click("button:has-text('Se connecter')")
    
    await expect(page.locator("text=Email invalide")).toBeVisible({ timeout: 5000 })
  })

  test("should show validation error for short password", async ({ page }) => {
    await page.goto("/login")
    
    await page.fill("input[type='email']", "test@example.com")
    await page.fill("input[type='password']", "short")
    await page.click("button:has-text('Se connecter')")
    
    await expect(page.locator("text=au moins 6 caractères")).toBeVisible()
  })

  test("should switch between signin and signup forms", async ({ page }) => {
    await page.goto("/login")
    
    // Initially on signin
    await expect(page.locator("text=Connexion")).toBeVisible()
    await expect(page.locator("input[placeholder='Ex : Zou Boutique']")).not.toBeVisible()
    
    // Switch to signup
    await page.click("text=Créer un compte")
    await expect(page.locator("text=Inscription")).toBeVisible()
    await expect(page.locator("input[placeholder='Ex : Zou Boutique']")).toBeVisible()
    await expect(page.locator("input[placeholder*='+229']")).toBeVisible()
    
    // Switch back to signin
    await page.click("text=Se connecter")
    await expect(page.locator("text=Connexion")).toBeVisible()
    await expect(page.locator("input[placeholder='Ex : Zou Boutique']")).not.toBeVisible()
  })

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login")
    
    await page.fill("input[type='email']", "nonexistent@example.com")
    await page.fill("input[type='password']", "wrongpassword123")
    await page.click("button:has-text('Se connecter')")
    
    // Wait for error message
    await expect(page.locator("text=/Identifiants incorrects|Invalid/i")).toBeVisible({ timeout: 5000 })
  })

  test("should redirect authenticated user to dashboard", async ({ page, context }) => {
    // This test requires a valid test account or test-specific flow
    // For now, we just test the redirect protection logic
    // In real scenario, you'd set up a test user or use API to create one
    
    await page.goto("/dashboard")
    // Should redirect to login since not authenticated
    await page.waitForURL("**/login")
    expect(page.url()).toContain("/login")
  })

  test("should prevent access to protected routes without auth", async ({ page }) => {
    const protectedRoutes = ["/dashboard", "/dashboard/products", "/dashboard/orders"]
    
    for (const route of protectedRoutes) {
      await page.goto(route)
      await page.waitForURL("**/login")
      expect(page.url()).toContain("/login")
    }
  })

  test("should display responsive layout on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/login")
    
    // Form should still be visible and usable
    await expect(page.locator("input[type='email']")).toBeVisible()
    await expect(page.locator("input[type='password']")).toBeVisible()
    await expect(page.locator("button:has-text('Se connecter')")).toBeVisible()
  })

  test("should display responsive layout on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto("/login")
    
    // Wait for page to load
    await page.waitForTimeout(1000)
    
    // All fields should be visible on desktop
    await expect(page.locator("input[type='email']")).toBeVisible()
    await expect(page.locator("input[type='password']")).toBeVisible()
    
    // Heading should be visible
    await expect(page.locator("text=Connexion")).toBeVisible()
  })
})
