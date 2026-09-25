import { type Page } from '@playwright/test';

export class ProductsPage {
  readonly title;
  readonly cartBadge;
  readonly prices;

  constructor(private readonly page: Page) {
    this.title = page.getByText('Products', { exact: true });
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.prices = page.getByTestId('inventory-item-price');
  }

  async addTwoProducts() {
    await this.page.getByTestId('inventory-item')
      .filter({ has: this.page.getByText('Sauce Labs Backpack', { exact: true }) })
      .getByRole('button', { name: 'Add to cart', exact: true }).click();
    await this.page.getByTestId('inventory-item')
      .filter({ has: this.page.getByText('Sauce Labs Bike Light', { exact: true }) })
      .getByRole('button', { name: 'Add to cart', exact: true }).click();
  }

  async openCart() {
    await this.page.getByRole('button', { name: /^Cart,/ }).click();
  }

  async sortByPriceLowToHigh() {
    await this.page.getByRole('combobox', { name: 'Sort products', exact: true }).selectOption({
      label: 'Price (low to high)',
    });
  }
}
