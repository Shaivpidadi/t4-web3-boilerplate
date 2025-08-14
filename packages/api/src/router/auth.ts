import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";

import { User, Session, CreateUserSchema, CreateSessionSchema } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  // TODO: Update this to work with Privy authentication
  getSession: publicProcedure.query(() => {
    // For now, return null since we're not using the old session system
    return null;
  }),
  
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),

  // New Privy verification endpoint
  verifyPrivy: publicProcedure
    .input(z.object({
      privyJwt: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Verify Privy JWT using Privy's server auth library
      // For now, we'll simulate the verification
      
      // Extract user info from JWT (in real implementation, verify with Privy)
      const mockUserInfo = {
        privyUserId: "mock-privy-user-id",
        email: "user@example.com",
        walletAddress: "0x1234567890abcdef",
      };

      // Upsert user
      const [user] = await ctx.db
        .insert(User)
        .values({
          privyUserId: mockUserInfo.privyUserId,
          email: mockUserInfo.email,
          walletAddress: mockUserInfo.walletAddress,
          lastLoginAt: new Date(),
        })
        .onConflictDoUpdate({
          target: User.privyUserId,
          set: {
            email: mockUserInfo.email,
            walletAddress: mockUserInfo.walletAddress,
            lastLoginAt: new Date(),
          },
        })
        .returning();

      if (!user) {
        throw new Error("Failed to create user");
      }

      // Create session (60 minutes)
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      const [session] = await ctx.db
        .insert(Session)
        .values({
          userId: user.id,
          token: sessionToken,
          expiresAt,
        })
        .returning();

      return {
        sessionToken,
        expiresAt,
        user: {
          id: user.id,
          email: user.email,
          walletAddress: user.walletAddress,
        },
      };
    }),

  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Add proper Privy JWT verification here
    // For now, we'll return mock data
    return {
      id: "mock-user-id",
      email: "user@example.com",
      walletAddress: "0x1234567890abcdef",
    };
  }),
} satisfies TRPCRouterRecord;
