import { ActionFunctionArgs } from "react-router";
import { db } from "../db/index.server";
import { ledger, profiles } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { calculateSplit } from "../utils/paystack.server";

const json = (data: any, options?: ResponseInit) => new Response(JSON.stringify(data), {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers }
});

/**
 * PAYSTACK WEBHOOK HANDLER
 * The source of truth for all financial movements.
 */
export async function action({ request }: ActionFunctionArgs) {
    const payload = await request.json();
    const sig = request.headers.get("x-paystack-signature");

    // TODO: Verify signature in production
    // if (!verifySignature(sig, payload)) return json({ error: "Invalid signature" }, { status: 400 });

    if (payload.event === "charge.success") {
        const { amount, metadata, reference } = payload.data;
        const nairaAmount = amount / 100;
        const { userId, creatorId, type } = metadata;

        return await db.transaction(async (tx: any) => {
            // 1. Fetch participants
            const fan = await tx.query.profiles.findFirst({ where: eq(profiles.id, userId) });
            const creator = await tx.query.profiles.findFirst({ where: eq(profiles.id, creatorId) });

            if (!creator) throw new Error("Target creator not found");

            // 2. Calculate Sovereign Split
            const hasReferrer = !!creator.referredBy;
            const split = calculateSplit(nairaAmount, hasReferrer);

            // 3. Record in Ledger
            await tx.insert(ledger).values({
                senderId: userId,
                receiverId: creatorId,
                amount: nairaAmount.toString(),
                creatorCut: split.creatorCut.toString(),
                platformCut: split.platformCut.toString(),
                referralCut: split.referralCut.toString(),
                type: type || 'unlock',
                status: 'success',
                paystackRef: reference
            });

            // 4. Update Creator Balance (80%)
            await tx.update(profiles)
                .set({ balance: sql`${profiles.balance} + ${split.creatorCut}` })
                .where(eq(profiles.id, creatorId));

            // 5. Update Referrer Balance (10% of platform cut) if exists
            if (hasReferrer && creator.referredBy) {
                await tx.update(profiles)
                    .set({ balance: sql`${profiles.balance} + ${split.referralCut}` })
                    .where(eq(profiles.id, creator.referredBy));
            }

            return json({ status: "Resonance Settled" });
        });
    }

    return json({ status: "Event ignored" });
}
