import { test as base } from '@playwright/test';
import { UsersClient } from '../api/UsersClient';

export const test = base.extend<{ usersApi: UsersClient }>({
  usersApi: async ({ request }, use) => { await use(new UsersClient(request)); },
});
export { expect } from '@playwright/test';
