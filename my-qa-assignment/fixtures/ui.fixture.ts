import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../test-data/scenarios';

export const test = base.extend<{
  login: LoginPage;
  products: ProductsPage;
  checkout: CheckoutPage;
  authenticatedProducts: ProductsPage;
}>({
  login: async ({ page }, use) => { await use(new LoginPage(page)); },
  products: async ({ page }, use) => { await use(new ProductsPage(page)); },
  checkout: async ({ page }, use) => { await use(new CheckoutPage(page)); },
  authenticatedProducts: async ({ login, products }, use) => {
    await login.goto();
    await login.login(users.standard.username, users.standard.password);
    await expect(products.title).toHaveText('Products');
    await use(products);
  },
});
export { expect } from '@playwright/test';
