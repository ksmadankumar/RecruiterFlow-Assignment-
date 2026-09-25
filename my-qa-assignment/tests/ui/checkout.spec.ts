import { test, expect } from '../../fixtures/ui.fixture';
import { basket, customer } from '../../test-data/scenarios';

test.describe('Checkout', { tag: ['@ui', '@checkout', '@regression'] }, () => {
  test('UI-CHECKOUT-001 | correct order totals and confirmation', { tag: '@smoke' }, async ({ page, authenticatedProducts: products, checkout }) => {
    await test.step('Prepare basket and submit customer details', async () => {
      await products.addTwoProducts();
      await products.openCart();
      await checkout.start();
      await checkout.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    });
    await test.step('Verify order overview and calculations', async () => {
      await expect(page.getByTestId('inventory-item-name')).toHaveText(basket.map(item => item.name));
      await expect(page.getByTestId('item-quantity')).toHaveText(['1', '1']);
      const subtotal = basket.reduce((sum, item) => sum + Math.round(item.price * 100), 0);
      const tax = Math.round(subtotal * 0.08);
      await expect(page.getByText(/^Item total:/)).toHaveText(`Item total: $${(subtotal / 100).toFixed(2)}`);
      await expect(page.getByText(/^Tax:/)).toHaveText(`Tax: $${(tax / 100).toFixed(2)}`);
      await expect(page.getByText(/^Total:/)).toHaveText(`Total: $${((subtotal + tax) / 100).toFixed(2)}`);
    });
    await test.step('Submit order and verify completion', async () => {
      await checkout.finish();
      await expect(checkout.confirmation).toHaveText('Thank you for your order!');
      await expect(products.cartBadge).toHaveCount(0);
    });
  });
  test('UI-CHECKOUT-002 | first name is required', { tag: '@negative' }, async ({ page, authenticatedProducts: products, checkout }) => {
    await products.addTwoProducts();
    await products.openCart();
    await checkout.start();
    await checkout.fillInformation('', customer.lastName, customer.postalCode);
    await expect(page.getByRole('alert')).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });
});

