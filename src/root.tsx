import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import React from "react";
import "./assets/css/global.css";
import { Analytics } from "@vercel/analytics/react";

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
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body
        style={{
          display: "block",
          margin: "auto auto",
          verticalAlign: "middle",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>Oh no!</h1>
        <p>
          It looks like something went wrong. The error has been reported to our
          team.
        </p>
        <Scripts />
      </body>
    </html>
  );
}
