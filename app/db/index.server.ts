import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const SUPABASE_DB_URL = "postgresql://postgres.bccyzexrlqorhvwoenjm:hNw6vNp0cTQoY3mE@16.16.102.12:5432/postgres?sslmode=require";

let _db: any = null;
let _sql: any = null;

export function initDb() {
    if (_db) return _db;

    const url = process.env.DATABASE_URL || SUPABASE_DB_URL;

    _sql = postgres(url, {
        max: 10, // Increased for Node.js environment
        ssl: { rejectUnauthorized: false },
        idle_timeout: 20
    });
    _db = drizzle(_sql, { schema });
    return _db;
}

export const db = new Proxy({}, {
    get(target, prop) {
        const instance = _db || initDb();
        return (instance as any)[prop];
    }
}) as any;

