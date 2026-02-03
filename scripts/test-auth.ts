import { register, login } from "../app/utils/auth.server";
import { db } from "../app/db/index.server";
import { users, profiles } from "../app/db/schema";
import { eq } from "drizzle-orm";

async function test() {
    const testEmail = `test_${Math.floor(Math.random() * 10000)}@efans.hub`;
    const testPassword = "sovereign_password_2026";
    const testName = "Test User";

    console.log("🚀 Starting Auth Protocol Test...");
    console.log(`📧 Target Identity: ${testEmail}`);

    try {
        // 1. Test Registration
        console.log("\n--- PHASE 1: REGISTRATION ---");
        const newUser = await register({
            email: testEmail,
            password: testPassword,
            name: testName,
            persona: 'creator'
        });
        console.log("✅ Registration Successful!");
        console.log(`🆔 User ID: ${newUser.id}`);

        // 2. Verify Profile Creation
        const profile = await db.query.profiles.findFirst({
            where: eq(profiles.id, newUser.id)
        });
        if (profile) {
            console.log("✅ Profile Resonance Established!");
            console.log(`🔖 Tag: @${profile.tag}`);
        } else {
            throw new Error("❌ Profile not found!");
        }

        // 3. Test Login
        console.log("\n--- PHASE 2: LOGIN ---");
        const loggedInUser = await login({
            email: testEmail,
            password: testPassword
        });
        console.log("✅ Login Successful!");
        console.log(`🔑 Validated Identity: ${loggedInUser.id}`);

        // 4. Cleanup (Optional but good for repeatable tests)
        console.log("\n--- PHASE 3: CLEANUP ---");
        await db.delete(users).where(eq(users.id, newUser.id));
        console.log("✅ Test Identity Purged.");

        console.log("\n✨ ALL AUTH PROTOCOLS OPERATIONAL.");
    } catch (error: any) {
        console.error("\n❌ TEST FAILED:", error.message);
        process.exit(1);
    }
}

test();
