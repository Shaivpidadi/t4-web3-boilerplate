import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
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
  walletAddress: t.text(),
  // Enhanced wallet information
  walletType: t.text().default('embedded'), // 'embedded' or 'external'
  currentChainId: t.text().default('1'), // Default to Ethereum mainnet
  preferredChainId: t.text().default('1'),
  createdAt: t.timestamp().defaultNow().notNull(),
  lastLoginAt: t.timestamp().defaultNow().notNull(),
}));

export const CreateUserSchema = createInsertSchema(User, {
  privyUserId: z.string(),
  email: z.string().email().optional(),
  walletAddress: z.string().optional(),
  walletType: z.string().optional(),
  currentChainId: z.string().optional(),
  preferredChainId: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  lastLoginAt: true,
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
