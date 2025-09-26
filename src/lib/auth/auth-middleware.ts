import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "@/lib/auth/auth-client";

export const authMiddleware = createMiddleware({
  type: "request",
}).server(async ({ next }) => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: getRequestHeaders(),
    },
  });
  return await next({
    context: {
      user: {
        id: session?.user.id,
        name: session?.user.name,
        image: session?.user.image,
      },
    },
  });
});
