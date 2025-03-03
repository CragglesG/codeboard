import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useNavigation,
} from "react-router";
import { Route } from "./+types/root";
import React from "react";
import "./assets/css/global.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ThemeProvider, { useTheme } from "./components/ThemeProvider";
import Loading from "./components/Loading";

const fixFlash = String.raw`(() => {
const theme = window.matchMedia('(prefers-color-scheme: light)').matches
? 'light'
: 'dark';

const cl = document.documentElement.classList;
const dataAttr = document.documentElement.dataset.theme;

if (dataAttr != null) {
const themeAlreadyApplied = dataAttr === 'light' || dataAttr === 'dark';
if (!themeAlreadyApplied) {
  document.documentElement.dataset.theme = theme;
}
} else {
const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
if (!themeAlreadyApplied) {
  cl.add(theme);
}
}

const meta = document.querySelector('meta[name=color-scheme]');
if (meta) {
if (theme === 'dark') {
  meta.content = 'dark light';
} else if (theme === 'light') {
  meta.content = 'light dark';
}
}
})()`;

export function UnwrappedLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="color-scheme"
          content={theme.theme === "light" ? "light dark" : "dark light"}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: fixFlash,
          }}
          suppressHydrationWarning
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <UnwrappedLayout>{children}</UnwrappedLayout>
    </ThemeProvider>
  );
}

export default function Root() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return <>{isNavigating ? <Loading /> : <Outlet />}</>;
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
