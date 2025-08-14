import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";

import { User, Session, Wallet, CreateUserSchema, CreateSessionSchema, CreateWalletSchema } from "@acme/db/schema";

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
      };

      // Upsert user
      const [user] = await ctx.db
        .insert(User)
        .values({
          privyUserId: mockUserInfo.privyUserId,
          email: mockUserInfo.email,
          lastLoginAt: new Date(),
        })
        .onConflictDoUpdate({
          target: User.privyUserId,
          set: {
            email: mockUserInfo.email,
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
    };
  }),

  // Get user wallets
  getWallets: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Add proper user authentication
    // For now, we'll return mock data
    return [
      {
        id: "mock-wallet-1",
        address: "0x1234567890abcdef",
        type: "embedded" as const,
        provider: "privy",
        chainId: "1",
        isPrimary: true,
        isActive: true,
      }
    ];
  }),

  // Create or update wallet
  upsertWallet: protectedProcedure
    .input(CreateWalletSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: Add proper user authentication
      // For now, we'll use a mock user ID
      const mockUserId = "mock-user-id";

      // Check if wallet already exists
      const existingWallet = await ctx.db
        .select()
        .from(Wallet)
        .where(
          and(
            eq(Wallet.userId, mockUserId),
            eq(Wallet.address, input.address)
          )
        )
        .limit(1);

      if (existingWallet.length > 0) {
        // Update existing wallet
        const existingWalletRecord = existingWallet[0];
        if (!existingWalletRecord) {
          throw new Error("Existing wallet record not found");
        }

        const updatedWallets = await ctx.db
          .update(Wallet)
          .set({
            type: input.type,
            provider: input.provider,
            chainId: input.chainId,
            isPrimary: input.isPrimary,
            isActive: input.isActive,
            updatedAt: new Date(),
          })
          .where(eq(Wallet.id, existingWalletRecord.id))
          .returning();

        const updatedWallet = updatedWallets[0];
        if (!updatedWallet) {
          throw new Error("Failed to update wallet");
        }

        return updatedWallet;
      } else {
        // Create new wallet
        const newWallets = await ctx.db
          .insert(Wallet)
          .values({
            userId: mockUserId,
            address: input.address,
            type: input.type,
            provider: input.provider,
            chainId: input.chainId,
            isPrimary: input.isPrimary,
            isActive: input.isActive,
          })
          .returning();

        const newWallet = newWallets[0];
        if (!newWallet) {
          throw new Error("Failed to create wallet");
        }

        return newWallet;
      }
    }),

  // Set primary wallet
  setPrimaryWallet: protectedProcedure
    .input(z.object({
      walletId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Add proper user authentication
      const mockUserId = "mock-user-id";

      // First, unset all primary wallets for this user
      await ctx.db
        .update(Wallet)
        .set({ isPrimary: false })
        .where(eq(Wallet.userId, mockUserId));

      // Then set the specified wallet as primary
      const primaryWallets = await ctx.db
        .update(Wallet)
        .set({ isPrimary: true })
        .where(eq(Wallet.id, input.walletId))
        .returning();

      const primaryWallet = primaryWallets[0];
      if (!primaryWallet) {
        throw new Error("Wallet not found");
      }

      return primaryWallet;
    }),

  // Deactivate wallet
  deactivateWallet: protectedProcedure
    .input(z.object({
      walletId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Add proper user authentication
      const deactivatedWallets = await ctx.db
        .update(Wallet)
        .set({ isActive: false })
        .where(eq(Wallet.id, input.walletId))
        .returning();

      const deactivatedWallet = deactivatedWallets[0];
      if (!deactivatedWallet) {
        throw new Error("Wallet not found");
      }

      return deactivatedWallet;
    }),
} satisfies TRPCRouterRecord;
