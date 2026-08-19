# Payload Starter

A [Payload 3.0](https://payloadcms.com) + Next.js 15 starter project. It ships pre-configured collections (Users, Media, Pages, Portfolio, Posts), globals (Header, Footer, SiteSettings), the Lexical rich-text editor, the form-builder plugin, and an MCP plugin.

This project uses **PostgreSQL** as its database (via `@payloadcms/db-postgres`) and **pnpm** as the package manager.

## Prerequisites

- **Node.js** `>=20.9.0` (or `^18.20.2`)
- **pnpm** `^9` or `^10` — install with `corepack enable` + `corepack prepare pnpm@latest --activate`, or see <https://pnpm.io/installation>
- **PostgreSQL** — either a local install or Docker (see below)
- **Docker** (optional) — only needed if you want to run Postgres via `docker compose`

## Quick start (local development)

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Create your environment file**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and set the variables from `.env.example`:

   | Variable                  | Description                                                                 |
   | ------------------------- | --------------------------------------------------------------------------- |
   | `DATABASE_URI`            | Postgres connection string. Default points at the local/Docker Postgres.    |
   | `PAYLOAD_SECRET`          | A random secret string used to sign JWTs. **Required** (any value).         |
   | `NEXT_PUBLIC_SERVER_URL`  | Public URL of the app. Defaults to `http://localhost:3000`.                 |

   A minimal `.env` for local use:

   ```bash
   DATABASE_URI=postgres://postgres:onlypgsql@127.0.0.1:5432/payload-starter
   PAYLOAD_SECRET=replace-with-a-random-string
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

3. **Start a PostgreSQL database**

   Either run Postgres locally so that `DATABASE_URI` matches, or use the provided Docker setup (recommended — see next section).

4. **Run the dev server**

   ```bash
   pnpm dev
   ```

5. Open <http://localhost:3000> in your browser and follow the on-screen instructions to create your first admin user.

That's it! Changes made in `./src` are reflected live. When you're ready to ship, see [Production](#production--deployment).

### Useful scripts

| Script                    | Purpose                                                  |
| ------------------------- | -------------------------------------------------------- |
| `pnpm dev`                | Start the Next.js dev server (hot reload).               |
| `pnpm build`              | Production build (`next build`).                         |
| `pnpm start`              | Serve the production build (`next start`).               |
| `pnpm generate:types`     | Regenerate `src/payload-types.ts` after schema changes.  |
| `pnpm generate:importmap` | Regenerate the Payload admin import map.                 |
| `pnpm lint`               | Run ESLint.                                              |
| `pnpm test`               | Run integration + end-to-end tests.                     |

> Tip: after changing any collection/global schema, run `pnpm generate:types` and `pnpm generate:importmap` so types and the admin panel stay in sync.

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

## Production / Deployment

### Build & serve (Node host)

On any host with Node.js and a reachable PostgreSQL instance:

```bash
pnpm install
pnpm build
pnpm start
```

`pnpm start` requires `DATABASE_URI` and `PAYLOAD_SECRET` to be set in the environment.

### Docker image

The included `Dockerfile` builds a standalone Next.js production image based on `node:22-alpine`.

> ⚠️ The `Dockerfile` relies on Next.js's [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output). Before building the image, add `output: 'standalone'` to `next.config.mjs`, e.g.:

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
