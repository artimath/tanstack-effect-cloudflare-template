import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/sonner";
import { seo } from "@/lib/seo";
import type { TRPCRouter } from "@/server/router";

import i18n from "@/lib/intl/i18n";
import { getServerTime } from "@/lib/server-time";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { ThemeProvider } from "next-themes";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { wrapCreateRootRouteWithSentry } from "@sentry/tanstackstart-react";

interface MyRouterContext {
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<TRPCRouter>;
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/react-router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = wrapCreateRootRouteWithSentry(createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Modern Full-Stack Boilerplate",
        description:
          "A feature-rich, type-safe starter for building modern web applications with React, tRPC, Drizzle ORM, and more.",
        keywords:
          "React, TypeScript, tRPC, Drizzle ORM, TanStack, Full-Stack, Web Development, Boilerplate, SaaS, Starter, Tailwind CSS",
      }),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: () => <RootDocument />,
  wrapInSuspense: true,

}));

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nextProvider i18n={i18n} defaultNS={"translation"}>
            <Outlet />
            <Toaster />
            <TanStackRouterDevtools />
            <Scripts />
          </I18nextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
