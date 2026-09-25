import { test, expect } from '../../fixtures/ui.fixture';
import { users } from '../../test-data/scenarios';

test.describe('Login', { tag: ['@ui', '@login', '@regression'] }, () => {
  test('UI-LOGIN-001 | standard user reaches inventory', { tag: ['@smoke', '@sanity'] }, async ({ page, login, products }) => {
    await test.step('Submit valid credentials', async () => {
      await login.goto();
      await login.login(users.standard.username, users.standard.password);
    });
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(products.title).toHaveText('Products');
  });
  for (const scenario of [
    { id: 'UI-LOGIN-002', name: 'locked user', ...users.locked, error: 'Epic sadface: Sorry, this user has been locked out.' },
    { id: 'UI-LOGIN-003', name: 'incorrect password', username: users.standard.username, password: 'incorrect-password', error: 'Epic sadface: Username and password do not match any user in this service' },
    { id: 'UI-LOGIN-004', name: 'empty username', username: '', password: users.standard.password, error: 'Epic sadface: Username is required' },
  ]) {
    test(`${scenario.id} | rejects ${scenario.name}`, { tag: '@negative' }, async ({ page, login }) => {
      await login.goto();
      await login.login(scenario.username, scenario.password);
      await expect(login.error).toHaveText(scenario.error);
      await expect(page).not.toHaveURL(/\/inventory\.html$/);
      await expect(login.loginButton).toBeVisible();
    });
  }
});

