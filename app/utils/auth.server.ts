import { db } from "../db/index.server";
import { users, profiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./crypto.server";
import { createUserSession } from "./session.server";

export async function register({ email, password, name, persona }: { email: string, password: string, name: string, persona: 'creator' | 'fan' }) {
    const existing = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existing) {
        throw new Error("Resonance already established with this identity.");
    }

    const passwordHash = await hashPassword(password);

    // Use a transaction to ensure both user and profile are created
    return await db.transaction(async (tx) => {
        const [newUser] = await tx.insert(users).values({
            email,
            passwordHash
        }).returning();

        await tx.insert(profiles).values({
            id: newUser.id,
            name,
            tag: email.split('@')[0] + Math.floor(Math.random() * 1000),
            persona
        });

        return newUser;
    });
}

export async function login({ email, password }: { email: string, password: string }) {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user) {
        throw new Error("Invalid credentials.");
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
        throw new Error("Invalid credentials.");
    }

    return user;
}
