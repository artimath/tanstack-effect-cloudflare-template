import { createServerFileRoute } from "@tanstack/react-start/server";
import { oAuthDiscoveryMetadata } from "better-auth/plugins";
import { auth } from "@/lib/auth/auth";

export const ServerRoute = createServerFileRoute("/.well-known/oauth-authorization-server").methods({
  // @ts-expect-error - TODO: fix this
  GET: oAuthDiscoveryMetadata(auth),
});
