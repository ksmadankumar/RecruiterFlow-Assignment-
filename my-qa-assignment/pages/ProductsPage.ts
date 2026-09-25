import { type Page } from '@playwright/test';

export class ProductsPage {
  readonly title;
  readonly cartBadge;
  readonly prices;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.prices = page.getByTestId('inventory-item-price');
  }

  async addTwoProducts() {
    await this.page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await this.page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  }

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  async sortByPriceLowToHigh() {
    await this.page.getByTestId('product-sort-container').selectOption({
      label: 'Price (low to high)',
    });
  }
}
