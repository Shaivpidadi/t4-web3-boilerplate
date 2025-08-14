import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const Post = pgTable("post", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// New User table for Privy authentication
export const User = pgTable("user", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  privyUserId: t.text().notNull().unique(),
  email: t.text(),
  createdAt: t.timestamp().defaultNow().notNull(),
  lastLoginAt: t.timestamp().defaultNow().notNull(),
}));

export const CreateUserSchema = createInsertSchema(User, {
  privyUserId: z.string(),
  email: z.string().email().optional(),
}).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
});

// New Wallet table to support multiple wallets per user
// This references the auth user table (which has text IDs)
export const Wallet = pgTable("wallet", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t.text().notNull(), // References auth.user.id (text type)
  address: t.text().notNull(),
  type: t.text().notNull().default('embedded'), // 'embedded' or 'external'
  provider: t.text().notNull().default('privy'), // 'privy', 'metamask', 'coinbase', etc.
  chainId: t.text().default('1'), // Current chain ID
  isPrimary: t.boolean().default(false), // Primary wallet for actions
  isActive: t.boolean().default(true), // Whether wallet is active
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreateWalletSchema = createInsertSchema(Wallet, {
  userId: z.string(),
  address: z.string(),
  type: z.enum(['embedded', 'external']),
  provider: z.string(),
  chainId: z.string().optional(),
  isPrimary: z.boolean().optional(),
  isActive: z.boolean().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Session table for app sessions
export const Session = pgTable("session", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t.uuid().notNull().references(() => User.id, { onDelete: "cascade" }),
  token: t.text().notNull().unique(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
}));

export const CreateSessionSchema = createInsertSchema(Session, {
  userId: z.string().uuid(),
  token: z.string(),
  expiresAt: z.date(),
}).omit({
  id: true,
  createdAt: true,
});

export * from "./auth-schema";
