import { createRequestHandler } from "react-router";
import { initDb } from "../app/db/index.server";

// Define Cloudflare types for the environment
interface Env {
  VALUE_FROM_CLOUDFLARE: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  SESSION_SECRET: string;
  PAYSTACK_SECRET_KEY: string;
  PAYSTACK_PUBLIC_KEY: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET_NAME: string;
  [key: string]: any;
}

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

interface ExportedHandler<E = Env> {
  fetch?: (request: Request, env: E, ctx: ExecutionContext) => Promise<Response> | Response;
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  // @ts-ignore
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Initialize DB with latest environment variables
    initDb(env);

    // Aggressive bridge for legacy process.env access in Workers
    // This ensures that even if 'process' or 'process.env' exists, we merge the Cloudflare env into it.
    const globalP = globalThis as any;
    if (!globalP.process) globalP.process = {};
    if (!globalP.process.env) globalP.process.env = {};

    // Merge Cloudflare environment variables into the process.env shim
    Object.assign(globalP.process.env, env);

    // Ensure NODE_ENV is set if not already present
    if (!globalP.process.env.NODE_ENV) {
      globalP.process.env.NODE_ENV = "production";
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
