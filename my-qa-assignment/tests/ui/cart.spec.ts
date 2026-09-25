import { test, expect } from '../../fixtures/ui.fixture';
import { basket } from '../../test-data/scenarios';

test.describe('Products and cart', { tag: ['@ui', '@cart', '@regression'] }, () => {
  test('UI-CART-001 | selected products and quantities appear in cart', { tag: ['@smoke', '@sanity'] }, async ({ page, authenticatedProducts: products }) => {
    await test.step('Add selected products', async () => {
      await products.addTwoProducts();
      await expect(products.cartBadge).toHaveText('2');
      await products.openCart();
    });
    await test.step('Verify cart content', async () => {
      await expect(page.getByTestId('inventory-item-name')).toHaveText(basket.map(item => item.name));
      await expect(page.getByTestId('item-quantity')).toHaveText(['1', '1']);
      await expect(page.getByTestId('inventory-item-price')).toHaveText(basket.map(item => `$${item.price.toFixed(2)}`));
    });
  });
  test('UI-CART-002 | all prices sort ascending without losing products', { tag: '@products' }, async ({ authenticatedProducts: products }) => {
    await expect(products.prices).toHaveCount(6);
    const before = (await products.prices.allTextContents()).map(price => Number(price.replace('$', '').trim()));
    expect(before.every(Number.isFinite)).toBe(true);
    await products.sortByPriceLowToHigh();
    const sorted = [...before].sort((a, b) => a - b).map(price => `$${price.toFixed(2)}`);
    await expect(products.prices).toHaveText(sorted);
  });
});

