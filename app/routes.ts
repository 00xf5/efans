import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("creators", "routes/creators.tsx"),
    route("creator/:username", "routes/creator-profile.tsx"),
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),
    route("timeline", "routes/timeline.tsx"),
    route("messages", "routes/messages.tsx"),
    route("notifications", "routes/notifications.tsx"),
    route("bookmarks", "routes/bookmarks.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("profile", "routes/profile.tsx"),
    route("about", "routes/about.tsx"),
    route("forgot", "routes/forgot.tsx"),
    route("pricing", "routes/plans.tsx"),
    route("logout", "routes/logout.ts"),
    route("health", "routes/health.ts"),

] satisfies RouteConfig;

