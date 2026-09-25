import { type APIRequestContext } from '@playwright/test';

export class UsersClient {
  constructor(private readonly request: APIRequestContext) {}
  list(page: number) { return this.request.get('/api/users', { params: { page } }); }
  get(id: number) { return this.request.get(`/api/users/${id}`); }
  create(data: { name: string; job: string }) { return this.request.post('/api/users', { data }); }
}
