import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const SUPABASE_DB_URL = "postgresql://postgres.bccyzexrlqorhvwoenjm:hNw6vNp0cTQoY3mE@16.16.102.12:5432/postgres?sslmode=require";

let _db: any = null;
let _sql: any = null;

export function initDb() {
    if (_db) return _db;

    const url = process.env.DATABASE_URL || SUPABASE_DB_URL;
    console.log("Initializing database connection...");

    try {
        _sql = postgres(url, {
            max: 10,
            ssl: { rejectUnauthorized: false },
            idle_timeout: 20,
            connect_timeout: 10
        });
        _db = drizzle(_sql, { schema });
        return _db;
    } catch (error) {
        console.error("Failed to initialize database connection:", error);
        throw error;
    }
}

export const db = new Proxy({}, {
    get(target, prop) {
        const instance = _db || initDb();
        return (instance as any)[prop];
    }
}) as any;

