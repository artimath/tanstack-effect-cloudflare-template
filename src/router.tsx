import { createRouter as createTanstackRouter, ErrorComponent } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import * as TanstackQuery from "./lib/trpc/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import DefaultLoading from "./components/default-loading";
import NotFound from "./components/not-found";

// Create a new router instance
export const createRouter = () => {
  const queryClient = TanstackQuery.createQueryClient();
  const serverHelpers = TanstackQuery.createServerHelpers({
    queryClient,
  });
  const router = routerWithQueryClient(
    createTanstackRouter({
      routeTree,
      context: {
        queryClient,
        trpc: serverHelpers,
      },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      defaultStaleTime: 0,
      defaultPreload: "intent",
      defaultViewTransition: true,
      defaultPendingComponent: DefaultLoading,
      defaultNotFoundComponent: NotFound,
      defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
      Wrap: (props: { children: React.ReactNode }) => {
        return <TanstackQuery.Provider queryClient={queryClient}>{props.children}</TanstackQuery.Provider>;
      },
    }),
    queryClient,
  );

  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
