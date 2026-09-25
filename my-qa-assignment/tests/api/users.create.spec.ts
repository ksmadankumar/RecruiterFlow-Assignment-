import { test, expect } from '../../fixtures/api.fixture';
import { jsonResponse } from '../../contracts/users';
import { newUser } from '../../test-data/scenarios';

test.describe('Users API: simulated creation', { tag: ['@api', '@users', '@regression'] }, () => {
  test('API-USERS-005 | create response echoes inputs and supplies metadata', { tag: ['@smoke', '@sanity'] }, async ({ usersApi }) => {
    const body = await test.step('Create demo user and validate HTTP contract', async () => jsonResponse(await usersApi.create(newUser), 201));
    await test.step('Verify response values and generated metadata', async () => {
      expect(body).toMatchObject(newUser);
      expect(body.id).toEqual(expect.any(String));
      expect(body.id).toMatch(/\S/);
      expect(body.createdAt).toEqual(expect.any(String));
      expect(body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(Number.isFinite(Date.parse(body.createdAt))).toBe(true);
    });
  });
});
