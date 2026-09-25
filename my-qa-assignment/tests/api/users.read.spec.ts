import { test, expect } from '../../fixtures/api.fixture';
import { expectUser, jsonResponse } from '../../contracts/users';

test.describe('Users API: read contracts', { tag: ['@api', '@users', '@regression'] }, () => {
  test('API-USERS-001 | populated page has valid users and pagination', { tag: ['@smoke', '@sanity'] }, async ({ usersApi }) => {
    const body = await test.step('Request page 2 and verify HTTP contract', async () => jsonResponse(await usersApi.list(2), 200));
    await test.step('Validate pagination and every user', async () => {
      expect(body).toMatchObject({ page: 2, per_page: 6, total: 12, total_pages: 2 });
      expect(body.data).toHaveLength(6);
      body.data.forEach(expectUser);
      expect(new Set(body.data.map((user: { id: number }) => user.id)).size).toBe(body.data.length);
    });
  });
  test('API-USERS-002 | existing user matches requested identity', { tag: '@sanity' }, async ({ usersApi }) => {
    const body = await jsonResponse(await usersApi.get(2), 200);
    expectUser(body.data);
    expect(body.data.id).toBe(2);
  });
  test('API-USERS-003 | missing user returns 404', { tag: '@negative' }, async ({ usersApi }) => {
    expect(await jsonResponse(await usersApi.get(23), 404)).toEqual({});
  });
  test('API-USERS-004 | page beyond available data is empty', { tag: '@boundary' }, async ({ usersApi }) => {
    const body = await jsonResponse(await usersApi.list(3), 200);
    expect(body).toMatchObject({ page: 3, per_page: 6, total: 12, total_pages: 2, data: [] });
  });
});
