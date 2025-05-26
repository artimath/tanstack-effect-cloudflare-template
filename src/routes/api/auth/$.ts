import { auth } from "@/lib/auth/auth"; // import your auth instance
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute().methods({
  GET: ({ request }) => {
    return auth.handler(request);
  },
  POST: ({ request }) => {
    return auth.handler(request);
  },
});
