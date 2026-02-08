import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { getUserId } from "./utils/session.server";

export async function loader({ request }: { request: Request }) {
  const userId = await getUserId(request);
  return { userId };
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&display=swap",
  },
];

import Navbar from "./components/Navbar";
import MobileHUD from "./components/MobileHUD";
import Footer from "./components/Footer";
import { useLocation } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  // Routes that should NOT have the global navbar/footer and use full-screen layout
  const sanctuaryRoutes = [
    '/timeline', '/messages', '/notifications', '/bookmarks',
    '/dashboard', '/profile', '/creators'
  ];

  const isSanctuary = sanctuaryRoutes.some(route => pathname.startsWith(route)) || pathname.startsWith('/creator/');
  const isAuth = ['/login', '/signup', '/forgot'].includes(pathname);

  return (
    <html lang="en" className="dark overflow-x-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function setVh(){document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px')}setVh();window.addEventListener('resize', setVh);})();`,
          }}
        />
      </head>
      <body className="premium-blur min-h-[calc(var(--vh,1vh)*100)] w-full bg-black text-white">
        {!isSanctuary && !isAuth && <Navbar />}
        <main className={`relative w-full ${isSanctuary ? 'h-screen overflow-hidden' : isAuth ? 'min-h-screen' : 'min-h-screen pt-16'}`}>
          {children}
          {!isSanctuary && !isAuth && <Footer />}
        </main>
        <MobileHUD />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
