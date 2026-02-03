import { createCookieSessionStorage, redirect } from "react-router";

// Safe access to environment variables
const getEnv = (key: string) => {
    if (typeof process !== "undefined" && process.env) {
        return process.env[key];
    }
    return undefined;
};

const sessionSecret = getEnv("SESSION_SECRET") || "sovereign_session_secret_2026";

export const storage = createCookieSessionStorage({
    cookie: {
        name: "efans_session",
        secure: getEnv("NODE_ENV") === "production",
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        httpOnly: true,
    },
});

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set("userId", userId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}

export async function getUserId(request: Request) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") return null;
    return userId;
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
    const userId = await getUserId(request);
    if (!userId) {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }
    return userId;
}

export async function logout(request: Request) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    return redirect("/", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}
