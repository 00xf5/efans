/**
 * PAYSTACK SETTLEMENT ENGINE
 * Handles the 80/20 split and referral protocol logic.
 */

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

export async function initiatePayment(email: string, amount: number, metadata: any) {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            amount: amount * 100, // Paystack uses kobo/cents
            metadata,
            callback_url: `${process.env.APP_URL || 'http://localhost:5173'}/payment/verify`,
        }),
    });

    return await response.json();
}

export async function verifyPayment(reference: string) {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
    });

    return await response.json();
}

/**
 * CALCULATE SOVEREIGN SPLIT
 * 80% to Creator
 * 20% to Platform (of which 10% goes to Referrer if exists)
 */
export function calculateSplit(amount: number, hasReferrer: boolean) {
    const creatorCut = amount * 0.80;
    const platformTotal = amount * 0.20;

    let referralCut = 0;
    let finalPlatformCut = platformTotal;

    if (hasReferrer) {
        referralCut = platformTotal * 0.10; // 10% of platform's 20%
        finalPlatformCut = platformTotal - referralCut;
    }

    return {
        creatorCut,
        platformCut: finalPlatformCut,
        referralCut,
        total: amount
    };
}
