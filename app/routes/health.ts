import postgres from "postgres";

export async function loader() {
    const rawUrl = process.env.DATABASE_URL || "postgresql://postgres.bccyzexrlqorhvwoenjm:hNw6vNp0cTQoY3mE@aws-0-eu-north-1.pooler.supabase.com:5432/postgres?sslmode=require";
    const maskedUrl = rawUrl.replace(/:[^:@]+@/, ":****@");

    const sql = postgres(rawUrl, { max: 1, ssl: { rejectUnauthorized: false } });

    try {
        const result = await sql`SELECT 1 as connected`;
        return {
            status: "Sovereign Connection Established",
            url: maskedUrl,
            result
        };
    } catch (error: any) {
        return {
            status: "Resonance Failure",
            url: maskedUrl,
            error: error.message
        };
    } finally {
        await sql.end();
    }
}
