# QA Assignment

Playwright + TypeScript: 8 UI tests and 5 API tests with stable case IDs.

## Setup and execution

Run inside `my-qa-assignment` using Node.js 20 or newer:

```powershell
npm install
npx playwright install chromium
npm run typecheck
npm test
npm run test:api
npm run test:ui
npm run test:smoke
npm run test:sanity
npm run test:regression
npx playwright test --grep '@login'
npx playwright test --project=chromium --headed --workers=1
npx playwright test --project=api --ui
npm run report
```

One worker is the default. Override with `--workers=2` when parallel execution is wanted.
API tests run only in the `api` project; UI tests run only in `chromium`.
`--headed` takes no browser value. API tests use HTTP requests and do not open application pages.

## Standards

- Locator preference: role with accessible name, then label/text/placeholder as appropriate,
  then `data-test` IDs, with CSS only as a last resort. Choose one verified locator;
  do not silently fall back when it fails. Password uses its accessible label because
  password inputs have no implicit textbox role. Test IDs identify repeated product
  containers, names, prices, quantities, and the cart badge. No CSS locators are needed.
- Stable IDs in test titles map to the coverage matrix below. Do not renumber existing IDs.
- Layer tags: `@ui`, `@api`. Feature tags: `@login`, `@cart`, `@products`, `@checkout`, `@users`.
- `@smoke`: small critical-path subset. `@regression`: all current tests.
- `@sanity`: focused login/cart and users API checks. Combine with a feature filter for the affected area; this is a documented team convention, not a universal definition.
- `@negative` and `@boundary` identify scenario intent.
- Native `test.step()` groups meaningful workflow stages; Cucumber step definitions are not required.
- UI fixtures instantiate page objects and optionally log in for each isolated test. Login tests exercise login directly.
- API fixtures supply a resource client backed by Playwright's isolated request fixture. HTTP/contract assertions remain outside the client.
- Shared public demo data is in `test-data/scenarios.ts`; scenario-specific negative inputs remain beside their parameterized tests.
- HTML reports and failure traces are saved; UI failure screenshots are enabled. Traces can contain request headers, so restrict access to artifacts when using real secrets.
- Strict TypeScript checking runs separately with `npm run typecheck`. CI rejects `test.only` and permits one retry; local runs have no retries.

## Coverage matrix

| ID | Scenario | Additional suite tags |
| --- | --- | --- |
| UI-LOGIN-001 | Valid login reaches inventory | smoke, sanity |
| UI-LOGIN-002 | Locked account rejected | negative |
| UI-LOGIN-003 | Wrong password rejected | negative |
| UI-LOGIN-004 | Empty username rejected | negative |
| UI-CART-001 | Selected names, prices, quantities and badge | smoke, sanity |
| UI-CART-002 | Complete ascending sort preserves prices | products |
| UI-CHECKOUT-001 | Items, quantities, subtotal, 8% demo tax, total and completion | smoke |
| UI-CHECKOUT-002 | Missing first name prevents progression | negative |
| API-USERS-001 | Page 2 metadata, nonempty result, field types and unique IDs | smoke, sanity |
| API-USERS-002 | Existing user contract and requested ID | sanity |
| API-USERS-003 | Missing user returns 404 and empty object | negative |
| API-USERS-004 | Page beyond dataset returns empty list | boundary |
| API-USERS-005 | Create response echoes payload with ID and valid timestamp | smoke, sanity |

## Environment and API scope

Optional environment variables: `UI_BASE_URL`, `API_BASE_URL`, and `REQRES_API_KEY`.
Overrides must expose the same application contracts and seed data; these are not generic tests for any API.
Real credentials belong in environment variables or the CI secret store, never committed test data.

The API tests cover Reqres public demo `/api/users` endpoints. The seeded list assumes 12 users and six per page. POST validates the simulated create response, not persistence; it does not fetch the generated ID or claim stored data exists. Public demo requests are rate-limited. If your environment requires a key, set `REQRES_API_KEY`.

References: https://reqres.in/ and https://reqres.in/docs . Reqres documentation distinguishes public demo endpoints from account-backed collections; the latter have different authentication and persistence contracts.

Out of scope: full CRUD, account-backed authentication, performance/security tests, every checkout validation combination, and additional browser engines. Extend these from agreed requirements rather than inventing unsupported error responses. Both services require network access; external outages and rate limits can fail this integration suite.
