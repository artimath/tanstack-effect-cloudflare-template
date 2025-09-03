import { createServerFileRoute } from '@tanstack/react-start/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/lib/trpc/init';
import { trpcRouter } from '@/server/router';

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: '/api/trpc',
    createContext: (opts) => {
      return createTRPCContext({
        ...opts,
        headers: opts.req.headers,
        req: opts.req,
      });
    },
  });
}

export const ServerRoute = createServerFileRoute('/api/trpc/$').methods({
  GET: handler,
  POST: handler,
  PUT: handler,
  DELETE: handler,
});
