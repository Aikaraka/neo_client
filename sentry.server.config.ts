// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",

  // 프로덕션에서도 더 많은 컨텍스트 정보 수집
  beforeSend(event, hint) {
    if (event.exception) {
      const error = hint.originalException;
      console.error("Sentry error captured:", {
        message: event.message,
        error: error,
        user: event.user,
        tags: event.tags,
        extra: event.extra,
      });
    }
    return event;
  },

  // 환경별 릴리스 정보
  environment: process.env.NODE_ENV,
});
