import { wrapCreateRootRouteWithSentry } from "@sentry/tanstackstart-react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { ThemeProvider } from "next-themes";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/sonner";
import i18n from "@/lib/intl/i18n";
import { seo } from "@/lib/seo";
import type { TRPCRouter } from "@/server/router";
import appCss from "../styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<TRPCRouter>;
}

export const Route = wrapCreateRootRouteWithSentry(
  createRootRouteWithContext<MyRouterContext>()({
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
  })
);

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange enableSystem>
          <I18nextProvider defaultNS={"translation"} i18n={i18n}>
            <Outlet />
            <Toaster />
            <TanStackDevtools
              config={{ defaultOpen: false }}
              plugins={[
                {
                  name: "Tanstack Query",
                  render: <ReactQueryDevtoolsPanel />,
                },
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
                {
                  name: "Drizzle Studio",
                  render: () => (
                    <iframe
                      src="https://local.drizzle.studio"
                      style={{
                        flexGrow: 1,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                    />
                  ),
                },
              ]}
            />
            <Scripts />
          </I18nextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
