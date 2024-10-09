import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import './root.module.scss';
import { UserPreferencesProvider } from "./lib/contexts/user-preferences.context";
import { SystemSettingsProvider } from "./lib/contexts/system-settings.context";
import { FileSystemProvider } from "./lib/contexts/file-system.context";
import { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <FileSystemProvider>
          <SystemSettingsProvider>
            <UserPreferencesProvider>
              {children}
            </UserPreferencesProvider>
          </SystemSettingsProvider>
        </FileSystemProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
