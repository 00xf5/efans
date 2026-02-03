import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const PROD_DB_URL = "postgresql://neondb_owner:npg_PgId2Tq3QCUW@ep-lingering-firefly-ahk6ijvu-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Safe access to environment variables
const getEnv = (key: string) => {
    if (typeof process !== "undefined" && process.env && process.env[key]) {
        return process.env[key];
    }
    return undefined;
};

// Handle WebSocket for Neon in Node.js environments
if (typeof WebSocket === "undefined") {
    try {
        // @ts-ignore
        import("ws").then(ws => {
            neonConfig.webSocketConstructor = ws.default || ws;
        }).catch(() => { });
    } catch (e) { }
}

let _db: any = null;

/**
 * INITIALIZE DB
 * This can be called manually in the worker's fetch handler to ensure
 * environment variables are correctly injected.
 */
export function initDb(env?: any) {
    const url = env?.DATABASE_URL || getEnv("DATABASE_URL") || PROD_DB_URL;
    if (!_db) {
        const pool = new Pool({ connectionString: url });
        _db = drizzle(pool, { schema });
    }
    return _db;
}

/**
 * DATABASE PROXY
 * Ensures we always have a connection, even if initialization hasn't been called.
 */
export const db = new Proxy({}, {
    get(target, prop) {
        const instance = _db || initDb();
        return (instance as any)[prop];
    }
}) as any;
