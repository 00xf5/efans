import {
    pgTable,
    text,
    timestamp,
    boolean,
    uuid,
    decimal,
    varchar,
    jsonb,
    integer
} from "drizzle-orm/pg-core";

// --- AUTH & CORE IDENTITY ---

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey().references(() => users.id, { onDelete: 'cascade' }),
    name: varchar("name", { length: 100 }),
    tag: varchar("tag", { length: 50 }).unique(),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    coverUrl: text("cover_url"),
    persona: varchar("persona", { length: 20 }).default("fan"), // 'creator', 'fan'
    balance: decimal("balance", { precision: 20, scale: 2 }).default("0.00").notNull(),
    referralCode: varchar("referral_code", { length: 50 }).unique(),
    referredBy: uuid("referred_by").references(() => users.id),
    isVerified: boolean("is_verified").default(false),

    // Privacy & Security Flags (Sovereign Mode)
    ghostMode: boolean("ghost_mode").default(false),
    cipherChat: boolean("cipher_chat").default(true),
    stealthMode: boolean("stealth_mode").default(false),

    // Metrics 
    resonanceScore: decimal("resonance_score", { precision: 10, scale: 2 }).default("100.00"),
    heatLevel: integer("heat_level").default(50),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- CONTENT & DISCOVERY ---

export const moments = pgTable("moments", {
    id: uuid("id").defaultRandom().primaryKey(),
    creatorId: uuid("creator_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    content: text("content"),
    type: varchar("type", { length: 20 }).default("flow"), // 'flow' (public), 'vision' (locked)
    mediaAssets: jsonb("media_assets").default([]), // [{ url: string, type: 'image' | 'video' }]
    price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
    isAegisGuided: boolean("is_aegis_guided").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- FINANCIAL LEDGER (THE 80/20 ENGINE) ---

export const ledger = pgTable("ledger", {
    id: uuid("id").defaultRandom().primaryKey(),
    senderId: uuid("sender_id").references(() => users.id),
    receiverId: uuid("receiver_id").references(() => users.id),
    amount: decimal("amount", { precision: 20, scale: 2 }).notNull(),

    // Splits calculated in real-time by the worker
    creatorCut: decimal("creator_cut", { precision: 20, scale: 2 }).notNull(),   // 80%
    platformCut: decimal("platform_cut", { precision: 20, scale: 2 }).notNull(), // 20%
    referralCut: decimal("referral_cut", { precision: 20, scale: 2 }).default("0.00"), // 10% of platform cut

    type: varchar("type", { length: 50 }).notNull(), // 'subscription', 'unlock', 'tip', 'boost', 'withdrawal'
    status: varchar("status", { length: 20 }).default("pending"),
    paystackRef: varchar("paystack_ref", { length: 100 }).unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- SOCIAL DYNAMICS ---

export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").defaultRandom().primaryKey(),
    fanId: uuid("fan_id").references(() => users.id).notNull(),
    creatorId: uuid("creator_id").references(() => users.id).notNull(),
    status: varchar("status", { length: 20 }).default("active"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const unlocks = pgTable("unlocks", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    momentId: uuid("moment_id").references(() => moments.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
