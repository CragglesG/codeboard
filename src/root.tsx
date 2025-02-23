import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import { Route } from "./+types/root";
import React from "react";
import "./assets/css/global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ThemeProvider from "./components/ThemeProvider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <br />
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        <h1>Unexpected Error</h1>
        <br />
        <p>
          Oops! Something went wrong. Please try again later, and if the error
          persists, please contact support.
        </p>
      </div>
    );
  } else {
    return (
      <h1 style={{ color: "white", textAlign: "center" }}>Unknown Error</h1>
    );
  }
}
