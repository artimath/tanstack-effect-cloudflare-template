import { auth } from "@/lib/auth/auth";

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { oAuthDiscoveryMetadata } from "better-auth/plugins";

// TODO: we are not able to use .well-known/oauth-authorization-server in tanstack start
export const APIRoute = createAPIFileRoute(
  "/api/well-known/oauth-authorization-server",
)({
  GET: oAuthDiscoveryMetadata(auth),
});
