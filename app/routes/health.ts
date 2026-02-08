import postgres from "postgres";

export async function loader() {
    const rawUrl = process.env.DATABASE_URL || "postgresql://postgres.bccyzexrlqorhvwoenjm:hNw6vNp0cTQoY3mE@aws-0-eu-north-1.pooler.supabase.com:5432/postgres?sslmode=require";
    const maskedUrl = rawUrl.replace(/:[^:@]+@/, ":****@");

    const sql = postgres(rawUrl, { max: 1, ssl: { rejectUnauthorized: false } });

    try {
        // ONE-TIME MIGRATION TO FIX MISSING COLUMNS
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(20)`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country VARCHAR(100)`;
        await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS willing_nsfw BOOLEAN DEFAULT FALSE`;

        const columns = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'profiles'
        `;

        const result = await sql`SELECT 1 as connected`;
        return {
            status: "Sovereign Connection Established - Migration Applied",
            url: maskedUrl,
            columns: columns.map((c: any) => c.column_name),
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
