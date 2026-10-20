# Grand Table 2026 Backend

## Architecture

The site runs Astro in server output mode (`output: "server"` in `astro.config.mjs`) on the Cloudflare adapter (`@astrojs/cloudflare`), deployed to Cloudflare Workers. Every page on the site is prerendered at build time **except**:

- `src/pages/api/grand-table/submit/[form].ts` (form submission API)
- `src/pages/grand-table/admin/*` (login, dashboard, detail, export, file download, logout)

Those routes set `export const prerender = false;` so they run per-request on the Worker and can read bindings, cookies, and request bodies.

Cloudflare bindings (declared in `wrangler.toml`):

- `GT_DB`: D1 database (`grand-table`). Stores submissions and a placeholder `content` table.
- `GT_UPLOADS`: R2 bucket (`grand-table-uploads`). Stores uploaded enterprise PDFs.
- `SESSION`: KV namespace. Not used by app code (admin auth uses a signed cookie, see Auth below); it exists only because the Cloudflare adapter auto-enables session storage via KV and logs an "Invalid binding" warning if the binding is missing. Placeholder only.

## Routes

| Route | Purpose |
| --- | --- |
| `/grand-table` | Public landing page (prerendered) |
| `/api/grand-table/submit/[form]` | `POST`: validates and stores a form submission (enterprise, delegate, sponsor, contact) |
| `/grand-table/admin/login` | Admin password login |
| `/grand-table/admin` | Submissions dashboard (tabs per form, status filter, search, pagination) |
| `/grand-table/admin/[form]/[id]` | Submission detail: status/notes edit, file download link |
| `/grand-table/admin/export/[form].csv` | `GET`: CSV export, respects `status` filter |
| `/grand-table/admin/file/[id]` | `GET`: streams the uploaded PDF from R2 (auth required) |
| `/grand-table/admin/logout` | Clears the session cookie |

## Data model

D1 table `submissions` (migration `migrations/0001_init.sql`):

- `id` (TEXT, PK, UUID)
- `form` (TEXT): one of `enterprise`, `delegate`, `sponsor`, `contact`
- `status` (TEXT, default `new`): `new` | `reviewing` | `accepted` | `declined` | `archived`
- `data` (TEXT): JSON blob of all submitted field values, keyed by field name (schema per form lives in `src/data/grand-table-forms.ts`)
- `email`, `name`: denormalized for list/search without parsing `data`
- `file_key`, `file_name`, `file_size`: set when the form has a file upload (enterprise only); `file_key` is the R2 object key (`enterprise/<submissionId>/<sanitizedFileName>`)
- `created_at`, `updated_at`: ISO timestamps
- `notes`: free-text admin notes

A `content` table exists (key/value) as a placeholder for future editable page content; nothing writes to it yet.

## Auth

Admin auth is a single shared password, not per-user accounts:

- `ADMIN_PASSWORD` (secret) is hashed and compared with a timing-safe check (`src/lib/gt/auth.ts`).
- On success, a session cookie (`gt_admin_session`, httpOnly, secure, sameSite strict, 8 hour max age) is set containing `expires.signature`, where `signature` is an HMAC-SHA256 of the expiry timestamp keyed by `SESSION_SECRET` (secret).
- Every admin page verifies the cookie signature and expiry server-side on each request (`getAuthedSession`).
- CSRF: the detail page's status/notes form embeds a token (`createCsrfToken`) that is itself an HMAC of the session token, keyed by `SESSION_SECRET`. The POST handler recomputes and compares it (`verifyCsrfToken`) before writing; on mismatch it shows an inline error instead of saving.
- All admin and API routes carry `<meta name="robots" content="noindex" />` since there is no public linking to them.
- Cloudflare Access is not configured yet; the plan is to add an Access policy on `/grand-table/admin*` later as a second auth layer in front of the password gate (see provisioning checklist below).

## Email

`src/lib/gt/email.ts` wraps the Resend API. `sendEmail()` only calls Resend when `EMAIL_ENABLED === "true"` **and** `RESEND_API_KEY` is set; otherwise it logs to console and returns (the stubbed/dev default). Templates live in `src/lib/gt/templates.ts`, one confirmation email per form (`confirmationEmail(form, name)` picks the copy by `form.id`, falling back to the contact template). The submit API sends a confirmation to the submitter's email if one was provided; there is no separate admin-notify send wired up yet even though `ADMIN_NOTIFY_TO` exists as a var for that purpose.

## Payments

`src/lib/gt/payments.ts` is a disabled placeholder: `createPaymentIntent`, `verifyPayment`, and `getPaymentStatus` all throw "Payments not activated". `isPaymentsEnabled(env)` reads `PAYMENTS_ENABLED`, which is `"false"` in `wrangler.toml` `[vars]`. The admin header shows a permanent "Payments: not activated" pill while this is off. No payment provider is integrated; this stays disabled until the client approves a provider and flow.

## Forms go-live flag

The public page reads `import.meta.env.PUBLIC_GT_FORMS_LIVE` (build-time env var, must be prefixed `PUBLIC_` to reach the client/SSR bundle) to decide whether registration forms are open. Set `PUBLIC_GT_FORMS_LIVE=true` only at launch (29 Oct); until then forms render in their pending/preview state.

## Local dev

```bash
npm run build
cp .dev.vars.example .dev.vars        # fill in ADMIN_PASSWORD / SESSION_SECRET / RESEND_API_KEY
npm run gt:migrate:local              # applies migrations/0001_init.sql to the local D1 shim
node scripts/gt-seed.mjs              # regenerates scripts/seed.dev.sql with fictitious sample rows
npm run gt:seed:local                 # loads seed.dev.sql into the local D1 shim
npm run gt:dev                        # wrangler dev on :8787, with real bindings via platformProxy
```

`npm run dev` (plain `astro dev`) is fine for page/styling work but does not have Cloudflare bindings; use `gt:dev` when testing submissions, admin, uploads, or auth.

## Production provisioning checklist (Muzaffar)

Run in order:

1. `npx wrangler d1 create grand-table`: paste the returned `database_id` into `wrangler.toml` (`d1_databases[0].database_id`, replacing `REPLACE_WITH_D1_ID`).
2. `npx wrangler d1 migrations apply grand-table --remote`: applies `migrations/0001_init.sql` to the production D1 database.
3. `npx wrangler r2 bucket create grand-table-uploads`
4. `npx wrangler kv namespace create SESSION`: paste the returned id into `wrangler.toml` (`kv_namespaces[0].id`, replacing `REPLACE_WITH_KV_ID`). This binding is a placeholder required by the adapter; the app does not read or write it.
5. Secrets (never commit these):
   - `npx wrangler secret put ADMIN_PASSWORD`
   - `npx wrangler secret put SESSION_SECRET` (32+ random characters)
   - `npx wrangler secret put RESEND_API_KEY`
6. Resend: add and verify the sending domain's DNS records (SPF, DKIM).
7. Set the `EMAIL_FROM` and `ADMIN_NOTIFY_TO` vars in `wrangler.toml` `[vars]` (or via `wrangler secret`/dashboard) to real addresses.
8. Set `EMAIL_ENABLED=true` only after sending a successful test email through Resend.
9. Set `PUBLIC_GT_FORMS_LIVE=true` at launch (29 Oct).
10. Cloudflare Workers Builds' deploy command must match the new `main` output path (`dist/_worker.js`), not an older path.
11. PR #1's `wrangler.jsonc` must **not** be merged as-is: it conflicts with this branch's `wrangler.toml` (duplicate config, and it is missing the D1/R2/KV bindings this app needs). Reconcile into a single config before merging.
12. Later: add a Cloudflare Access policy in front of `/grand-table/admin*` as a second auth layer.
13. Payments stay `PAYMENTS_ENABLED=false` until the client approves a provider and flow.
