import * as Sentry from "@sentry/tanstackstart-react";
import { type AnyFunctionMiddleware, createMiddleware, registerGlobalMiddleware } from "@tanstack/react-start";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { createRouter } from "./router";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  // Learn more at
  // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,
  enabled: process.env.NODE_ENV === "production",
});

let streamHandler = defaultStreamHandler;

streamHandler = Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler);

const isProduction = process.env.NODE_ENV === "production";

const middleware: AnyFunctionMiddleware[] = [
  createMiddleware({ type: "function" }).server(async ({ next, functionId, method, context, response }) => {
    const prev = performance.now();
    const result = await next();
    const duration = performance.now() - prev;
    // const headers = getHeaders();
    console.info(
      `${functionId.replaceAll("_", "/").replaceAll("/ts", ".ts").replaceAll("--", " => ")} ${method} ${duration.toFixed(2)}ms`,
    );
    // console.info(headers);
    return result;
  }),
];

if (isProduction) {
  middleware.push(createMiddleware({ type: "function" }).server(Sentry.sentryGlobalServerMiddlewareHandler()));
}

registerGlobalMiddleware({
  middleware,
});

export default createStartHandler({
  createRouter,
})(streamHandler);
