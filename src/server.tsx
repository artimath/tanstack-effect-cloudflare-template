// import * as Sentry from "@sentry/tanstackstart-react";
// import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import handler from '@tanstack/react-start/server-entry'

// Sentry.init({
//   dsn: process.env.VITE_SENTRY_DSN,
//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for tracing.
//   // We recommend adjusting this value in production
//   // Learn more at
//   // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
//   tracesSampleRate: 1.0,
//   enabled: process.env.NODE_ENV === "production",
// });

// const customHandler = (request: Request, response: Response) => {
//   const streamHandler = Sentry.wrapStreamHandlerWithSentry(defaultStreamHandler);
//   return streamHandler;
// };

// const fetch = createStartHandler(customHandler());

// export default {
//   fetch,
// };


export default {
  fetch(request: Request) {
    return handler.fetch(request)
  },
}