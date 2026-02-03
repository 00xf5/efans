import { SignJWT, jwtVerify } from "jose";

// Safe access to environment variables
const getEnv = (key: string) => {
    if (typeof process !== "undefined" && process.env) {
        return process.env[key];
    }
    return undefined;
};

const SECRET = new TextEncoder().encode(getEnv("JWT_SECRET") || "default_sovereign_secret");

export async function createJWT(userId: string) {
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(SECRET);
}

export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload.userId as string;
    } catch (e) {
        return null;
    }
}
