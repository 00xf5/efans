import { db } from "../db/index.server";
import { otpVerifications } from "../db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string) {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store in DB
    await db.insert(otpVerifications).values({
        email,
        code,
        expiresAt
    });

    // TRANSMISSION VIA RESEND
    try {
        await resend.emails.send({
            from: "eFans <onboarding@resend.dev>",
            to: email,
            subject: "Your eFans Resonance Code",
            html: `
                <div style="font-family: 'Outfit', sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 20px; text-align: center; border: 1px solid #333;">
                    <h1 style="font-style: italic; font-weight: 900; letter-spacing: -1px; margin-bottom: 20px;">eFans Onboarding</h1>
                    <p style="color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 30px;">Identity Calibration Protocol</p>
                    <div style="background: #111; padding: 30px; border-radius: 15px; border: 1px solid #222;">
                        <span style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #ec4899;">${code}</span>
                    </div>
                    <p style="color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-top: 30px; font-style: italic;">Code expires in 15 minutes. Establish resonance immediately.</p>
                </div>
            `
        });
    } catch (error) {
        console.error("Resend Transmission Failure:", error);
    }

    // Still log for local visibility
    console.log(`[TRANSMISSION LOG] To: ${email}, Code: ${code}`);

    return { success: true, code };
}

export async function verifyOTP(email: string, code: string) {
    const records = await db.select()
        .from(otpVerifications)
        .where(eq(otpVerifications.email, email))
        .orderBy(otpVerifications.createdAt);

    const latest = records[records.length - 1];

    if (!latest || latest.code !== code) {
        throw new Error("Invalid resonance code. Protocol mismatch.");
    }

    if (new Date() > latest.expiresAt) {
        throw new Error("Resonance code expired. Re-initiate calibration.");
    }

    // Clean up used OTPs
    await db.delete(otpVerifications).where(eq(otpVerifications.email, email));

    return true;
}
