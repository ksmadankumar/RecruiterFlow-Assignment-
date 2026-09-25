import { type Page } from '@playwright/test';

export class CheckoutPage {
  readonly confirmation;

  constructor(private readonly page: Page) {
    this.confirmation = page.getByRole('heading', { name: 'Thank you for your order!', exact: true });
  }

  async start() {
    await this.page.getByRole('button', { name: 'Checkout', exact: true }).click();
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.page.getByRole('textbox', { name: 'First Name', exact: true }).fill(firstName);
    await this.page.getByRole('textbox', { name: 'Last Name', exact: true }).fill(lastName);
    await this.page.getByRole('textbox', { name: 'Zip/Postal Code', exact: true }).fill(postalCode);
    await this.page.getByRole('button', { name: 'Continue', exact: true }).click();
  }

  async finish() {
    await this.page.getByRole('button', { name: 'Finish', exact: true }).click();
  }
}
