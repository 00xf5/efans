import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const SUPABASE_DB_URL = "postgresql://postgres.bccyzexrlqorhvwoenjm:hNw6vNp0cTQoY3mE@aws-0-eu-north-1.pooler.supabase.com:5432/postgres?sslmode=require";

let _db: any = null;
let _sql: any = null;

export function initDb() {
    if (_db) return _db;

    const url = process.env.DATABASE_URL || SUPABASE_DB_URL;
    console.log("Establishing Sovereign Connection to Database...");

    try {
        _sql = postgres(url, {
            max: 1, // Optimized for serverless to prevent connection exhaustion
            ssl: { rejectUnauthorized: false },
            idle_timeout: 20,
            connect_timeout: 15,
            prepare: false // Recommended for use with connection poolers
        });
        _db = drizzle(_sql, { schema });
        return _db;
    } catch (error) {
        console.error("Failed to establish Sovereign Connection:", error);
        throw error;
    }
}

export const db = new Proxy({}, {
    get(target, prop) {
        const instance = _db || initDb();
        const value = (instance as any)[prop];
        // Critical: Bound functions to maintain 'this' context in Drizzle
        return typeof value === 'function' ? value.bind(instance) : value;
    }
}) as any;

