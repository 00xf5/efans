import { db } from "../db/index.server";
import { users, profiles } from "../db/schema";
import { eq, or } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./crypto.server";
import { createUserSession } from "./session.server";

export async function register({
    email,
    password,
    name,
    persona,
    phone,
    gender,
    country,
    willingNsfw,
    referredBy
}: {
    email: string,
    password: string,
    name: string,
    persona: 'creator' | 'fan',
    phone?: string,
    gender?: string,
    country?: string,
    willingNsfw?: boolean,
    referredBy?: string
}) {
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const existing = existingUsers[0];

    if (existing) {
        throw new Error("Resonance already established with this identity.");
    }

    const passwordHash = await hashPassword(password);

    // Referral Validation Loop
    let referrerId: string | null = null;
    if (referredBy) {
        // Try finding by tag (clean @ if present)
        const cleanTag = referredBy.startsWith('@') ? referredBy.slice(1) : referredBy;
        const referrer = await db.query.profiles.findFirst({
            where: or(
                eq(profiles.tag, cleanTag),
                eq(profiles.referralCode, referredBy)
            )
        });
        if (referrer) {
            referrerId = referrer.id;
        }
    }

    return await db.transaction(async (tx: any) => {
        const [newUser] = await tx.insert(users).values({
            email,
            passwordHash
        }).returning();

        await tx.insert(profiles).values({
            id: newUser.id,
            name,
            tag: email.split('@')[0] + Math.floor(Math.random() * 1000),
            persona,
            phone,
            gender,
            country,
            willingNsfw,
            referredBy: referrerId
        });

        return newUser;
    });
}

export async function login({ email, password }: { email: string, password: string }) {
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const user = existingUsers[0];


    if (!user) {
        throw new Error("Invalid credentials.");
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
        throw new Error("Invalid credentials.");
    }

    return user;
}
