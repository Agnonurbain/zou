# Tests E2E avec Playwright

## Installation

Les dépendances Playwright sont déjà installées. Pour les installer manuellement :

```bash
npm install --save-dev @playwright/test
```

## Commandes de test

### Lancer tous les tests E2E
```bash
npm run test:e2e
```

### Lancer les tests en mode UI (interactif)
```bash
npm run test:e2e:ui
```

### Lancer les tests en mode headed (voir le navigateur)
```bash
npm run test:e2e:headed
```

### Lancer les tests en mode debug
```bash
npm run test:e2e:debug
```

### Voir le rapport HTML après les tests
```bash
npx playwright show-report
```

## Structure des tests

Les tests E2E se trouvent dans `tests/e2e/`:

- `auth.spec.ts` : Tests des flux d'authentification (login, signup, logout, routes protégées)

## Couverture actuelle

### Auth Flow
- ✅ Redirection unauthenticated `/` → `/login`
- ✅ Affichage du formulaire de connexion
- ✅ Toggle de visibilité du mot de passe
- ✅ Validation des erreurs (email invalide, password court)
- ✅ Basculement signin/signup
- ✅ Erreur pour identifiants incorrects
- ✅ Protection des routes `/dashboard/*`
- ✅ Responsive mobile et desktop

## Configurer des tests

Les fichiers de test doivent :
1. Être dans `tests/e2e/`
2. Utiliser l'extension `.spec.ts`
3. Importer `test` et `expect` de `@playwright/test`

```typescript
import { test, expect } from "@playwright/test"

test("example test", async ({ page }) => {
  await page.goto("/login")
  await expect(page.locator("text=Connexion")).toBeVisible()
})
```

## Configuration

Le fichier `playwright.config.ts` contient :
- **baseURL** : `http://localhost:3000`
- **browsers** : Chromium et Firefox
- **webServer** : Lance automatiquement `npm run dev`
- **reporters** : HTML et liste en console
- **trace** : Capture les traces sur première tentative échouée
- **screenshots** : Uniquement en cas d'échec

## Mode CI

Si la variable d'env `CI` est définie :
- Les tests s'exécutent séquentiellement
- Retry automatique 2 fois
- Les tests sont visibles dans le rapport HTML

## Prochaines étapes

1. Tests de la page dashboard (navigation, sidebar)
2. Tests des produits (CRUD)
3. Tests des commandes (CRUD)
4. Tests d'intégration Supabase
