import {
    pgTable,
    text,
    timestamp,
    boolean,
    uuid,
    decimal,
    varchar,
    jsonb,
    integer,
    index
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

    // Creator Onboarding Fields
    phone: varchar("phone", { length: 20 }),
    gender: varchar("gender", { length: 20 }),
    country: varchar("country", { length: 100 }),
    willingNsfw: boolean("willing_nsfw").default(false),

    referralCode: varchar("referral_code", { length: 50 }).unique(),
    referredBy: uuid("referred_by").references(() => users.id),
    isVerified: boolean("is_verified").default(false),

    // Privacy & Security Flags (Sovereign Mode)
    ghostMode: boolean("ghost_mode").default(false),
    cipherChat: boolean("cipher_chat").default(true),
    stealthMode: boolean("stealth_mode").default(false),
    aggressiveSanitization: boolean("aggressive_sanitization").default(true),

    // Metrics 
    resonanceScore: decimal("resonance_score", { precision: 10, scale: 2 }).default("100.00"),
    heatLevel: integer("heat_level").default(50),
    subscriptionPrice: decimal("subscription_price", { precision: 10, scale: 2 }).default("15000.00"),

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
    requiredTier: varchar("required_tier", { length: 20 }).default("Acquaintance"), // 'Acquaintance', 'Acolyte', 'Zealot', 'Sovereign Soul'
    isAegisGuided: boolean("is_aegis_guided").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        creatorIdIdx: index("moments_creator_id_idx").on(table.creatorId),
        typeIdx: index("moments_type_idx").on(table.type),
    };
});

export const whispers = pgTable("whispers", {
    id: uuid("id").defaultRandom().primaryKey(),
    momentId: uuid("moment_id").references(() => moments.id, { onDelete: 'cascade' }).notNull(),
    fanId: uuid("fan_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    content: text("content").notNull(),
    status: varchar("status", { length: 20 }).default("pure"), // 'pure', 'redacted', 'rejected'
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        momentIdIdx: index("whispers_moment_id_idx").on(table.momentId),
        fanIdIdx: index("whispers_fan_id_idx").on(table.fanId),
    };
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
}, (table) => {
    return {
        senderIdIdx: index("ledger_sender_id_idx").on(table.senderId),
        receiverIdIdx: index("ledger_receiver_id_idx").on(table.receiverId),
        typeIdx: index("ledger_type_idx").on(table.type),
    };
});

// --- SOCIAL DYNAMICS ---

export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").defaultRandom().primaryKey(),
    fanId: uuid("fan_id").references(() => users.id).notNull(),
    creatorId: uuid("creator_id").references(() => users.id).notNull(),
    status: varchar("status", { length: 20 }).default("active"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    tier: varchar("tier", { length: 20 }).default("Standard"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        fanIdIdx: index("subscriptions_fan_id_idx").on(table.fanId),
        creatorIdIdx: index("subscriptions_creator_id_idx").on(table.creatorId),
    };
});

export const unlocks = pgTable("unlocks", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    momentId: uuid("moment_id").references(() => moments.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        userIdIdx: index("unlocks_user_id_idx").on(table.userId),
        momentIdIdx: index("unlocks_moment_id_idx").on(table.momentId),
    };
});

export const loyaltyStats = pgTable("loyalty_stats", {
    id: uuid("id").defaultRandom().primaryKey(),
    fanId: uuid("fan_id").references(() => users.id).notNull(),
    creatorId: uuid("creator_id").references(() => users.id).notNull(),
    lifetimeResonance: decimal("lifetime_resonance", { precision: 20, scale: 2 }).default("0.00").notNull(),
    tier: varchar("tier", { length: 20 }).default("Acquaintance"), // 'Acquaintance', 'Acolyte', 'Zealot', 'Sovereign Soul'
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => {
    return {
        fanCreatorIdx: index("loyalty_stats_fan_creator_idx").on(table.fanId, table.creatorId),
    };
});
// --- PRIVATE WHISPERS (MESSAGING) ---

export const conversations = pgTable("conversations", {
    id: uuid("id").defaultRandom().primaryKey(),
    participantOneId: uuid("participant_one_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    participantTwoId: uuid("participant_two_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id").references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
    senderId: uuid("sender_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    content: text("content"),
    type: varchar("type", { length: 20 }).default("text"), // 'text', 'vision', 'gift'
    metadata: jsonb("metadata").default({}), // { price: string, previewUrl: string, description: string, giftAmount: string }
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- THE ECHO CHAMBER (NOTIFICATIONS) ---

export const echoes = pgTable("echoes", {
    id: uuid("id").defaultRandom().primaryKey(),
    recipientId: uuid("recipient_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    senderId: uuid("sender_id").references(() => users.id, { onDelete: 'cascade' }),
    type: varchar("type", { length: 20 }).notNull(), // 'pulse', 'vision', 'whisper', 'resonance'
    content: text("content"),
    link: text("link"),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pulses = pgTable("pulses", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    momentId: uuid("moment_id").references(() => moments.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const otpVerifications = pgTable("otp_verifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 6 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        emailIdx: index("otp_email_idx").on(table.email),
    };
});

export const userRelations = relations(users, ({ one, many }) => ({
    profile: one(profiles, { fields: [users.id], references: [profiles.id] }),
    moments: many(moments),
    whispers: many(whispers),
    subscriptions: many(subscriptions),
}));

export const profileRelations = relations(profiles, ({ one, many }) => ({
    user: one(users, { fields: [profiles.id], references: [users.id] }),
    loyaltyStats: many(loyaltyStats, { relationName: "fanToLoyalty" }),
}));

export const momentRelations = relations(moments, ({ one, many }) => ({
    creator: one(profiles, { fields: [moments.creatorId], references: [profiles.id] }),
    whispers: many(whispers),
}));

export const whisperRelations = relations(whispers, ({ one }) => ({
    moment: one(moments, { fields: [whispers.momentId], references: [moments.id] }),
    fan: one(profiles, { fields: [whispers.fanId], references: [profiles.id] }),
}));

export const loyaltyStatsRelations = relations(loyaltyStats, ({ one }) => ({
    fan: one(profiles, { fields: [loyaltyStats.fanId], references: [profiles.id], relationName: "fanToLoyalty" }),
    creator: one(profiles, { fields: [loyaltyStats.creatorId], references: [profiles.id], relationName: "creatorToLoyalty" }),
}));
