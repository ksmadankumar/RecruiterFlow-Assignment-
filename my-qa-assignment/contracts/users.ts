import { expect, type APIResponse } from '@playwright/test';

export async function jsonResponse(response: APIResponse, status: number) {
  expect(response.status(), `Unexpected status for ${response.url()}`).toBe(status);
  expect(response.headers()['content-type']).toMatch(/application\/json/i);
  return response.json();
}

export function expectUser(user: Record<string, unknown>) {
  expect(user).toEqual(expect.objectContaining({
    id: expect.any(Number), email: expect.any(String),
    first_name: expect.any(String), last_name: expect.any(String), avatar: expect.any(String),
  }));
  expect(Number.isInteger(user.id)).toBe(true);
  expect(user.id).toBeGreaterThan(0);
  expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  expect(user.first_name).toMatch(/\S/);
  expect(user.last_name).toMatch(/\S/);
  expect(user.avatar).toMatch(/^https:\/\//);
}
