import { createFileRoute } from "@tanstack/react-router";
import { oAuthDiscoveryMetadata } from "better-auth/plugins";
import { auth } from "@/lib/auth/auth";

export const Route = createFileRoute("/.well-known/oauth-authorization-server")({
  server: {
    handlers: {
  GET: ({ request }) => oAuthDiscoveryMetadata(auth)(request),
  },
  },
});

//   // @ts-expect-error - TODO: fix this
//   GET: oAuthDiscoveryMetadata(auth),
// });
