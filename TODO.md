# Comprehensive Effect Game Plan for TanStack Effect Cloudflare Template

Awesome—let's "Effect-ify" that TanStack Start template on **Cloudflare Workers**, now and progressively. Below is a staged plan with concrete file drops, package choices (Neon _or_ D1), and code you can paste. I'll start with **"backend + typesafe RPC"** (keep the UI mostly as-is), then show **full-stack Effect** with `@effect-atom/atom(-react)` in React, and finally email + observability notes.

> **What's current as of Sept 26, 2025**
>
> - Effect 3.x with `@effect/schema`/`@effect/rpc`/`@effect/platform` is stable and documented. ([Effect][1])
> - Official **Effect SQL adapters** exist for Postgres and Cloudflare D1, plus a **Drizzle bridge** (so you can keep Drizzle). ([Effect TS][2])
> - **Cloudflare Email**: Email _sending_ is in **private beta** under "Cloudflare Email Service"; Email Routing + "send to verified addresses" is documented & GA. Use Resend/MailChannels until sending exits beta. ([The Cloudflare Blog][3])
> - TanStack Start **server routes** are the right place to mount an Effect RPC HTTP handler on Workers. ([TanStack][4])

---

## Stage 1 — Backend only: swap tRPC → `@effect/rpc` (HTTP), validate with `@effect/schema`, keep your current React

**Install (pick one DB path below):**

```bash
# core
pnpm add effect @effect/schema @effect/rpc @effect/rpc-http @effect/platform
# DB if you want Neon (Postgres) via Drizzle in Workers (HTTP/WebSocket driver)
pnpm add drizzle-orm @effect/sql @effect/sql-drizzle @neondatabase/serverless
# OR DB if you want Cloudflare D1
pnpm add @effect/sql @effect/sql-d1
```

### 1) Define shared schemas + RPC contracts

`src/shared/schemas.ts`

```ts
import * as S from '@effect/schema/Schema';

export const UserId = S.String.pipe(S.minLength(1), S.brand('UserId'));
export const Email = S.String.pipe(
  S.pattern(/^[^@]+@[^@]+\.[^@]+$/),
  S.brand('Email'),
);

export class RegisterInput extends S.Class<RegisterInput>('RegisterInput')({
  email: Email,
  password: S.String.pipe(S.minLength(8)),
}) {}

export class RegisterResult extends S.Class<RegisterResult>('RegisterResult')({
  userId: UserId,
}) {}

export class AppError extends S.Class<AppError>('AppError')({
  message: S.String,
  code: S.optional(
    S.Literal('BAD_REQUEST', 'UNAUTHORIZED', 'CONFLICT', 'INTERNAL'),
  ),
}) {}
```

`src/shared/rpc.ts`

```ts
import { Rpc, RpcGroup } from '@effect/rpc';
import * as S from '@effect/schema/Schema';
import { RegisterInput, RegisterResult, AppError } from './schemas';

export class Api extends RpcGroup.make(
  // unary example
  Rpc.make('register', {
    payload: RegisterInput,
    success: RegisterResult,
    error: AppError,
  }),
  // example read
  Rpc.make('whoami', {
    payload: S.Void,
    success: S.Struct({ userId: S.String, email: S.String }),
    error: AppError,
  }),
) {}
```

> `RpcGroup` definitions are shared by server & client; they're fully typed and schema-validated. ([typeonce.dev][5])

### 2) Wire the RPC server (as a TanStack **server route**)

`src/server/rpcServer.ts`

```ts
import { Effect, Layer } from 'effect';
import { Api } from '@/shared/rpc';
import * as RpcServer from '@effect/rpc-http';
import * as HttpApp from '@effect/platform/HttpApp';
import * as S from '@effect/schema/Schema';

// Services you'll use (DB, auth, etc.) are provided via Layers
export const Live = Layer.empty; // fill in DB/auth Layers below

// Implementations for the API methods
const handlers = {
  register: ({
    payload,
  }: {
    payload: S.Schema.Type<typeof Api>['register']['payload'];
  }) =>
    Effect.gen(function* () {
      // do DB insert, uniqueness checks, etc.
      // return `RegisterResult`
      return { userId: 'u_123' } as const;
    }),

  whoami: () => Effect.succeed({ userId: 'u_123', email: 'demo@example.com' }),
};

export const rpcWebHandler = RpcServer.toHttpApp(Api, handlers).pipe(
  Effect.provide(Live),
  Effect.map(HttpApp.toWebHandler), // -> (req: Request) => Promise<Response>
);
```

`src/routes/api/rpc/$.ts` (TanStack **Server Route** at `/api/rpc/*`)

```ts
import { createFileRoute } from '@tanstack/react-router';
import { rpcWebHandler } from '@/server/rpcServer';

export const Route = createFileRoute('/api/rpc/$')({
  server: {
    handlers: {
      // route everything (POST recommended) to Effect RPC
      POST: async ({ request }) => rpcWebHandler(request),
      OPTIONS: async () => new Response(null, { status: 204 }),
    },
  },
});
```

> Start's server routes let us pass the native `Request` straight into the Effect RPC web handler on Workers. ([TanStack][4])

### 3) Database (choose one)

**A. Neon (Postgres) on Workers, keep Drizzle dialect**
Use Neon's serverless driver (`@neondatabase/serverless`) with Drizzle; wrap through `@effect/sql-drizzle` so your DB lives in an Effect `Layer`. ([Drizzle ORM][6])

`src/server/db/neon.ts`

```ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { Layer } from 'effect';
import * as SqlDrizzle from '@effect/sql-drizzle';

export const neonSqlDrizzleLayer = Layer.sync(() => {
  const sql = neon(process.env.DATABASE_URL!); // put in wrangler secret
  const db = drizzle(sql);
  return SqlDrizzle.makeLayer({ db }); // exposes SqlClient compatible interface
});
```

> Neon's HTTP/WebSocket drivers are the supported way from serverless/edge (Workers). ([Neon][7])

**B. Cloudflare D1 + Effect SQL**
Cloudflare-native, simplest ops; use `@effect/sql-d1` which exposes a `SqlClient` Layer around your D1 binding. ([npm][8])

`src/server/db/d1.ts`

```ts
import { Layer } from 'effect';
import { D1Client } from '@effect/sql-d1';

export const d1SqlLayer = Layer.effect(
  D1Client,
  D1Client.layer({
    // expects env.DB binding
    database: (globalThis as any).DB,
  }),
);
```

> D1's Effect adapter is first-party and documented (API: `D1Client`). ([Effect TS][9])

Then compose your `Live` Layer:

```ts
// src/server/rpcServer.ts (replace Live = Layer.empty)
import { Layer } from 'effect';
// choose one:
import { neonSqlDrizzleLayer } from './db/neon';
// import { d1SqlLayer } from "./db/d1"

export const Live = Layer.mergeAll(
  neonSqlDrizzleLayer,
  // d1SqlLayer,
);
```

---

## Stage 2 — Client calls (still "classic" React): derive a typesafe RPC client

You can consume the same `Api` contract on the client:

`src/lib/rpcClient.ts`

```ts
import { Api } from '@/shared/rpc';
import * as RpcClient from '@effect/rpc/RpcClient';
import * as RpcSerialization from '@effect/rpc/RpcSerialization';
import { FetchHttpClient, HttpClient } from '@effect/platform';
import { Layer, Effect } from 'effect';

export const RpcProtocol = RpcClient.layerProtocolHttp({
  baseUrl: '/api/rpc',
  // POST for everything (works well with Workers)
}).pipe(
  Layer.provide(FetchHttpClient.layer),
  Layer.provide(RpcSerialization.layerJson),
);

export const call = <K extends keyof Api['_handlers'] & string>(
  key: K,
  payload: Parameters<Api['_handlers'][K]>[0],
) =>
  Effect.gen(function* () {
    const client = yield* RpcClient.make(Api);
    return yield* client(key, payload);
  }).pipe(Effect.provide(RpcProtocol));
```

> Effect RPC supplies an HTTP protocol and JSON serialization layers; the client is inferred from the shared `RpcGroup`. ([typeonce.dev][5])

Use it anywhere (loader, component, server function):

```ts
import { call } from '@/lib/rpcClient';
const res = await call('whoami', undefined);
```

---

## Stage 3 — Full-stack Effect in React with **`@effect-atom/atom-react`**

If you want to "Effect all the things" on the client, replace/augment React Query with **`@effect-atom/atom-react`**:

```bash
pnpm add @effect-atom/atom-react
```

**Set up a runtime Atom** (provides an Effect runtime to your component tree):

`src/app/atoms/runtime.ts`

```ts
import { Atom } from '@effect-atom/atom-react';
import { Layer } from 'effect';
import { RpcProtocol } from '@/lib/rpcClient';

// add more layers as needed (Feature flags, Browser KVS, etc.)
export const runtimeAtom = Atom.runtime(Layer.mergeAll(RpcProtocol));
```

**Use the built-in RPC integration**:

```tsx
// src/app/atoms/auth.tsx
import {
  AtomRpc,
  Result,
  useAtomValue,
  useAtomSet,
} from '@effect-atom/atom-react';
import { Api } from '@/shared/rpc';
import * as RpcClient from '@effect/rpc/RpcClient';
import * as RpcSerialization from '@effect/rpc/RpcSerialization';
import { FetchHttpClient } from '@effect/platform';
import { Layer } from 'effect';

class AuthClient extends AtomRpc.Tag<AuthClient>()('AuthClient', {
  group: Api,
  protocol: RpcClient.layerProtocolHttp({ baseUrl: '/api/rpc' }).pipe(
    Layer.provide(FetchHttpClient.layer),
    Layer.provide(RpcSerialization.layerJson),
  ),
}) {}

export function Profile() {
  const me = useAtomValue(
    AuthClient.query('whoami', undefined, { reactivityKeys: ['me'] }),
  );
  if (Result.isLoading(me)) return <p>Loading...</p>;
  if (Result.isFailure(me)) return <p>Error</p>;
  return <pre>{JSON.stringify(me.value, null, 2)}</pre>;
}

export function RegisterButton() {
  const register = useAtomSet(AuthClient.mutation('register'));
  return (
    <button
      onClick={() =>
        register({
          payload: { email: 'a@b.com', password: 'hunter2' },
          reactivityKeys: ['me'],
        })
      }
    >
      Register
    </button>
  );
}
```

`effect-atom` also supports derived state, Streams, localStorage, URL params, and invalidation via `@effect/experimental/Reactivity`. ([GitHub][10])

---

## Stage 4 — Email (Workers)

**What's available today:**

- **Email Routing + Email Workers** lets Workers process mail and **send to verified addresses** (good for internal alerts, logs). ([Cloudflare Docs][11])
- **Cloudflare Email Service (sending)** is **private beta** (external transactional sending to arbitrary recipients). Track the beta or request access. ([The Cloudflare Blog][3])
- Production alternatives on Workers: **Resend** (great DX, React Email) or **MailChannels Email API** (paid; free tier sunset). ([Resend][12])

**Effect service wrapper (provider-agnostic):**

`src/server/email/Email.ts`

```ts
import { Effect } from 'effect';

export class EmailService extends Effect.Service<EmailService>()(
  'app/EmailService',
  {
    // swap impls by Layer
    effect: Effect.succeed({
      send: (_: { to: string; subject: string; html: string }) => Effect.void,
    }),
  },
) {}
```

**Resend Live (works on Workers):**

```ts
// src/server/email/resend.ts
import { Layer, Effect } from 'effect';
import { EmailService } from './Email';
export const ResendLive = Layer.effect(
  EmailService,
  Effect.succeed({
    send: ({ to, subject, html }) =>
      Effect.tryPromise({
        try: () =>
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'noreply@yourdomain.com',
              to,
              subject,
              html,
            }),
          }),
        catch: (e) => e as Error,
      }).pipe(Effect.unit),
  }),
);
```

> Resend documents Workers integration. If Cloudflare Email Sending GA's for all recipients, mount a `Email` binding and swap the Layer. ([Resend][12])

---

## Stage 5 — Observability (optional but recommended)

- Use `@effect/opentelemetry` for tracing/metrics and wire it to OTLP; add Sentry's Workers SDK if you want error capture too. ([Effect][13])

---

## Minimal code diff summary (what you remove / add)

**Remove**

- `@trpc/*` packages, server adapter, routers
- Zod schemas that are only used for runtime checking (migrate to `@effect/schema`)

**Add**

- `src/shared/schemas.ts`, `src/shared/rpc.ts`
- `src/server/rpcServer.ts`
- `src/routes/api/rpc/$.ts` (server route)
- One DB layer (`src/server/db/neon.ts` **or** `src/server/db/d1.ts`)
- (Stage 3) `@effect-atom/atom-react` usage + atoms runtime

---

## DB: which one to ship?

- **Neon**: Postgres features, branching, and fast HTTP driver; Cloudflare recommends Neon or Hyperdrive for Postgres from Workers. Keep Drizzle and add `@effect/sql-drizzle` to bring it into the Effect world. ([Neon][7])
- **D1**: Built-in, simple & low latency; use `@effect/sql-d1` directly. ([npm][8])
- **PlanetScale**: Serverless MySQL with global read replicas; now has direct Workers integration. Consider as alternative to Neon for MySQL workloads. ([blog.cloudflare.com/planetscale-postgres-workers](https://blog.cloudflare.com/planetscale-postgres-workers))

---

## Notes on Workers + TanStack Start

- Host on Workers using Start's Cloudflare instructions (Vite plugin or `target: 'cloudflare-module'`). Mount server routes as shown above. ([Cloudflare Docs][14])
- If you keep TanStack Query initially, it coexists fine. Later you can move query/mutation logic to `effect-atom` + `AtomRpc` to make client state, side-effects, and server calls all uniform. ([GitHub][10])

---

## Future Considerations

- **Review MCP Integration**: Evaluate Cloudflare's new "Code Mode" feature ([blog.cloudflare.com/code-mode](https://blog.cloudflare.com/code-mode)) for potential enhancement or replacement of the current MCP server implementation. Code Mode provides AI assistants with direct access to codebases through MCP, which could offer more seamless integration than the current `@vercel/mcp-adapter` approach.
- **Cloudflare Data Platform**: Review the broader Cloudflare data platform ecosystem ([blog.cloudflare.com/cloudflare-data-platform](https://blog.cloudflare.com/cloudflare-data-platform)) for future database/storage options beyond D1, including potential integrations with other Cloudflare data services.
- **Developer Platform Updates**: Review comprehensive platform improvements ([blog.cloudflare.com/cloudflare-developer-platform-keeps-getting-better-faster-and-more-powerful](https://blog.cloudflare.com/cloudflare-developer-platform-keeps-getting-better-faster-and-more-powerful)) including:
  - **Remote Bindings GA**: Connect to production services from local development for better DX
  - **Enhanced Node.js APIs**: node:fs, node:https, node:dns, node:net, node:tls, node:crypto now supported - improves compatibility
  - **Workers Builds GA**: 20GB disk, 4 vCPUs for faster builds and larger projects
  - **AI Search**: Multi-provider model support (OpenAI, Anthropic) via AI Gateway
  - **Browser Rendering**: Playwright GA, Stagehand for AI agents, higher concurrency limits
  - **R2 Infrequent Access GA**: Lower-cost storage for backups and logs

---

## Why `@effect/rpc` (vs `effect-http`)?

- `@effect/rpc` gives you a single source of truth (schemas + names → **derived server & client**), streaming support, middleware, and protocols for HTTP or WebSocket. `effect-http` is a community lib for declarative HTTP APIs if you prefer OpenAPI-ish modeling; either is fine, but RPC is usually the lighter swap for tRPC-style apps. ([typeonce.dev][5])

---

## Finish line checklist

1. **Install** packages (Stage 1 list).
2. **Create** `schemas.ts`, `rpc.ts`, `rpcServer.ts`, and the **server route** at `/api/rpc`. ([TanStack][4])
3. **Pick a DB** layer (Neon+Drizzle via `@effect/sql-drizzle` **or** D1 via `@effect/sql-d1`) and provide it to the RPC server `Live` layer. ([Effect TS][15])
4. **Swap calls** in your loaders/components to use the derived RPC client (or wait until Stage 3). ([typeonce.dev][5])
5. **Email**: wire Resend now; revisit Cloudflare Email Sending when it's GA (or if you get into the beta). ([Resend][12])
6. (Optional) **effect-atom**: replace React Query pieces incrementally with `AtomRpc` queries/mutations and `Result` handling. ([GitHub][10])

---

### References (docs I used)

- Effect main/docs & release notes, `@effect/schema`, `@effect/rpc`, `@effect/platform`. ([Effect][16])
- Effect SQL adapters (`@effect/sql-pg`, `@effect/sql-d1`, `@effect/sql-drizzle`). ([Effect TS][2])
- TanStack Start **server routes** and **hosting on Cloudflare**. ([TanStack][4])
- Neon on Workers & Drizzle HTTP driver. ([Neon][17])
- `@effect-atom/atom(-react)` + RPC integration examples. ([GitHub][10])
- Cloudflare Email Service (private beta) + Email Routing "send to verified" docs; Resend Workers guide; MailChannels sunset. ([The Cloudflare Blog][3])

---

If you want, I can tailor the exact patches to **Neon+Drizzle** _or_ **D1** against your repo's structure (drop-in files + `package.json` changes)—just say which DB and whether you want to flip the client to `effect-atom` now or keep React Query for a bit.

[1]: https://effect.website/blog/tags/releases/?utm_source=chatgpt.com 'Releases'
[2]: https://effect-ts.github.io/effect/docs/sql-pg?utm_source=chatgpt.com '@effect/sql-pg - effect'
[3]: https://blog.cloudflare.com/email-service/?utm_source=chatgpt.com "Announcing Cloudflare Email Service's private beta"
[4]: https://tanstack.com/start/latest/docs/framework/react/server-routes 'Server Routes | TanStack Start React Docs'
[5]: https://www.typeonce.dev/snippet/effect-rpc-http-client-complete-example 'Effect Rpc http client complete example | Typeonce'
[6]: https://orm.drizzle.team/docs/connect-neon?utm_source=chatgpt.com 'Drizzle ORM - Neon'
[7]: https://neon.com/docs/serverless/serverless-driver?utm_source=chatgpt.com 'Neon serverless driver - Neon Docs'
[8]: https://www.npmjs.com/package/%40effect/sql-d1?activeTab=readme&utm_source=chatgpt.com 'effect/sql-d1'
[9]: https://effect-ts.github.io/effect/sql-d1/D1Client.ts.html 'D1Client.ts - effect'
[10]: https://github.com/tim-smart/effect-atom 'GitHub - tim-smart/effect-atom'
[11]: https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/?utm_source=chatgpt.com 'Send emails from Workers'
[12]: https://resend.com/docs/send-with-cloudflare-workers?utm_source=chatgpt.com 'Send emails with Cloudflare Workers'
[13]: https://effect.website/docs/additional-resources/api-reference/?utm_source=chatgpt.com 'API Reference | Effect Documentation'
[14]: https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack/?utm_source=chatgpt.com 'TanStack · Cloudflare Workers docs'
[15]: https://effect-ts.github.io/effect/docs/sql-drizzle?utm_source=chatgpt.com '@effect/sql-drizzle - effect'
[16]: https://effect.website/?utm_source=chatgpt.com 'Effect – The best way to build robust apps in TypeScript'
[17]: https://neon.com/docs/guides/cloudflare-workers?utm_source=chatgpt.com 'Use Neon with Cloudflare Workers - Neon Docs'
