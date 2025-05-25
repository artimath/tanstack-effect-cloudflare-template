import { createAPIFileRoute } from "@tanstack/react-start/api";
import { oAuthDiscoveryMetadata } from "better-auth/plugins";
import { auth } from "../../../lib/auth/auth";

export const APIRoute = createAPIFileRoute(
  ".well-known/oauth-authorization-server",
)({
  // @ts-expect-error TODO: fix this type
  GET: oAuthDiscoveryMetadata(auth),
});
