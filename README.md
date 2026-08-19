# Payload Starter

A [Payload 3.0](https://payloadcms.com) + Next.js 15 starter project. It ships pre-configured collections (Users, Media, Pages, Portfolio, Posts), globals (Header, Footer, SiteSettings), the Lexical rich-text editor, the form-builder plugin, and an MCP plugin.

This project uses **PostgreSQL** as its database (via `@payloadcms/db-postgres`) and **pnpm** as the package manager.

## Prerequisites

- **Node.js** `>=20.9.0` (or `^18.20.2`)
- **pnpm** `^9` or `^10` — enable with `corepack enable` + `corepack prepare pnpm@latest --activate`, or see <https://pnpm.io/installation>
- **PostgreSQL** — either a local install or Docker (see below)
- **Docker** (optional) — only needed if you want to run Postgres via `docker compose`

> Requires the versions declared in `package.json` → `engines` (`node` `^18.20.2 || >=20.9.0`, `pnpm` `^9 || ^10`).

## Quick start (local development)

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Create your environment file**

   ```bash
   cp .env.example .env
   ```

   > `.env` is gitignored — it will never be committed. Never put real secrets into `.env.example`.

   Then set the variables in `.env` (see [Environment variables](#environment-variables)):

   ```bash
   DATABASE_URI=postgres://postgres:onlypgsql@127.0.0.1:5432/payload-starter
   PAYLOAD_SECRET=replace-with-a-random-string
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

3. **Start a PostgreSQL database**

   Either run Postgres locally so that `DATABASE_URI` matches, or use the provided Docker setup (recommended — see [Local development with Docker](#local-development-with-docker-postgres)).

4. **Run the dev server**

   ```bash
   pnpm dev
   ```

   If you need a clean restart (drops the `.next` cache), use:

   ```bash
   pnpm devsafe
   ```

5. Open <http://localhost:3000> in your browser and follow the on-screen instructions to create your first admin user. The admin panel lives at <http://localhost:3000/admin>.

That's it! Changes made in `./src` are reflected live. When you're ready to ship, see [Production / Deployment](#production--deployment).

### Useful scripts

| Script                    | Purpose                                                                  |
| ------------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`                | Start the Next.js dev server (hot reload).                               |
| `pnpm devsafe`            | Clear `.next` and start a clean dev server.                              |
| `pnpm build`              | Production build (`next build`).                                         |
| `pnpm start`              | Serve the production build (`next start`).                               |
| `pnpm generate:types`     | Regenerate `src/payload-types.ts` after schema changes.                  |
| `pnpm generate:importmap` | Regenerate the Payload admin import map.                                 |
| `pnpm lint`               | Run ESLint.                                                              |
| `pnpm test`               | Run integration + end-to-end tests.                                       |

> Tip: after changing any collection/global schema, run `pnpm generate:types` and `pnpm generate:importmap` so types and the admin panel stay in sync.

### Database migrations

Migrations in `src/migrations/` are applied automatically when the server boots, so a fresh checkout will create its tables on first run — no manual `migrate` step is required. Generate new migrations when you change the schema and want them version-controlled.

## Environment variables

Copy `.env.example` → `.env` and fill in the following:

| Variable                  | Description                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `DATABASE_URI`            | Postgres connection string. Default points at the local/Docker Postgres (see below).         |
| `PAYLOAD_SECRET`          | A random secret string used to sign JWTs. **Required** — use any long random value.          |
| `NEXT_PUBLIC_SERVER_URL`  | Public URL of the app. Defaults to `http://localhost:3000` (set your domain in production).  |

A minimal `.env` for local use:

```bash
DATABASE_URI=postgres://postgres:onlypgsql@127.0.0.1:5432/payload-starter
PAYLOAD_SECRET=replace-with-a-random-string
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Generate a strong secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Local development with Docker (Postgres)

If you'd rather not install Postgres locally, the provided `docker-compose.yml` spins up a **PostgreSQL 17** container that matches `.env.example` out of the box:

- Database: `payload-starter`
- User: `postgres`
- Password: `onlypgsql`
- Port: `5432` (exposed at `127.0.0.1:5432`)

Steps:

1. Make sure `.env` exists (`cp .env.example .env`) and that `DATABASE_URI` matches the credentials above.
2. Start the database (add `-d` to run in the background):

   ```bash
   docker compose up
   ```

3. In another terminal, start the app:

   ```bash
   pnpm install
   pnpm dev
   ```

4. Open <http://localhost:3000> and create your first admin user.

> Note: `docker-compose.yml` references `./pgsql-multidb.sh` as an init entrypoint. The primary `payload-starter` database is created automatically via the `POSTGRES_DB` environment variable, so the app works without any extra setup. The init script only provisions optional additional databases/roles.

## Running locally as a production build

To verify a real production deployment on your machine (no hot reload, tree-shaken build), run:

```bash
pnpm install
pnpm build
pnpm start
```

`pnpm start` requires `DATABASE_URI` and `PAYLOAD_SECRET` to be set in the environment (they are read from `.env` automatically). The app listens on port `3000`.

## Production / Deployment

### Build & serve (Node host)

On any host with Node.js and a reachable PostgreSQL instance:

```bash
pnpm install
pnpm build
pnpm start
```

### Docker image

The included `Dockerfile` builds a standalone Next.js production image based on `node:22-alpine`.

> ⚠️ The `Dockerfile` relies on Next.js's [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output). Before building the image, add `output: 'standalone'` to `next.config.mjs`, e.g.:
>
> ```js
> const nextConfig = {
>   output: 'standalone',
>   // ...existing config
> }
> ```

Then build and run:

```bash
docker build -t payload-starter .
docker run -p 3000:3000 \
  -e DATABASE_URI=postgres://... \
  -e PAYLOAD_SECRET=... \
  -e NEXT_PUBLIC_SERVER_URL=https://your-domain.com \
  payload-starter
```

The container listens on port `3000`.

## Troubleshooting

- **`Error: connect ECONNREFUSED 127.0.0.1:5432`** — Postgres isn't running or `DATABASE_URI` is wrong. Start the DB (`docker compose up`) and confirm the host/port/credentials match `.env`.
- **`PAYLOAD_SECRET` missing / invalid JWTs** — set a non-empty `PAYLOAD_SECRET` in `.env`. Changing it after users exist will invalidate existing sessions.
- **Port 3000 already in use** — either stop the process using it or change the port via `PORT=4000 pnpm dev` / `pnpm start`.
- **Admin panel looks unstyled / component errors** — regenerate the admin artifacts after schema or component changes: `pnpm generate:types && pnpm generate:importmap`, then `pnpm devsafe`.
- **Blank DB / missing collections on first run** — tables are created by auto-migrations on boot; confirm the app can reach Postgres and restart `pnpm dev`.

## How it works

The Payload config (`src/payload.config.ts`) is tailored for a typical content site and is pre-configured as follows.

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend them.

- **Users** — auth-enabled collection with admin-panel access. See the [Authentication](https://payloadcms.com/docs/authentication/overview) docs for help.
- **Media** — uploads collection with pre-configured image sizes, focal point, and manual resizing.
- **Pages**, **Portfolio**, **Posts** — content collections for the site.

### Globals

- **Header**, **Footer**, **SiteSettings** — site-wide configuration available across the app.

### Plugins

- **Form Builder** (`@payloadcms/plugin-form-builder`) — `forms` and `form-submissions` collections.
- **MCP** (`@payloadcms/plugin-mcp`) — enabled for `users` and `forms`.

## Questions

If you have any issues or questions, reach out on [Discord](https://discord.com/invite/payload) or open a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
