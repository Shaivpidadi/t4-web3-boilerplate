-- Migration: Add wallet table and update user table
-- This migration adds support for multiple wallets per user

-- First, create the new wallet table
-- Note: This references the auth.user table which has text IDs, not UUIDs
CREATE TABLE IF NOT EXISTS "wallet" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL, -- References auth.user.id (text type)
  "address" text NOT NULL,
  "type" text NOT NULL DEFAULT 'embedded',
  "provider" text NOT NULL DEFAULT 'privy',
  "chain_id" text DEFAULT '1',
  "is_primary" boolean DEFAULT false,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "wallet_user_id_idx" ON "wallet"("user_id");
CREATE INDEX IF NOT EXISTS "wallet_address_idx" ON "wallet"("address");
CREATE INDEX IF NOT EXISTS "wallet_primary_idx" ON "wallet"("is_primary") WHERE "is_primary" = true;

-- Add unique constraint to ensure one primary wallet per user
CREATE UNIQUE INDEX IF NOT EXISTS "wallet_user_primary_idx" ON "wallet"("user_id") WHERE "is_primary" = true;

-- Add foreign key constraint to auth.user table
-- Note: We need to ensure the auth.user table exists first
DO $$
BEGIN
  -- Check if the auth.user table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'user' AND table_schema = 'public'
  ) THEN
    -- Add foreign key constraint
    ALTER TABLE "wallet" 
    ADD CONSTRAINT "wallet_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
  END IF;
END $$;

-- Migrate existing wallet data from user table (if any)
-- This assumes the old user table had walletAddress, walletType, currentChainId fields
-- If these don't exist, this migration will be skipped

DO $$
BEGIN
  -- Check if the old columns exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user' AND column_name = 'wallet_address'
  ) THEN
    -- Migrate existing wallet data
    INSERT INTO "wallet" ("user_id", "address", "type", "provider", "chain_id", "is_primary", "is_active")
    SELECT 
      id as user_id,
      wallet_address as address,
      COALESCE(wallet_type, 'embedded') as type,
      'privy' as provider,
      COALESCE(current_chain_id, '1') as chain_id,
      true as is_primary,
      true as is_active
    FROM "user" 
    WHERE wallet_address IS NOT NULL;
    
    -- Remove old columns
    ALTER TABLE "user" DROP COLUMN IF EXISTS "wallet_address";
    ALTER TABLE "user" DROP COLUMN IF EXISTS "wallet_type";
    ALTER TABLE "user" DROP COLUMN IF EXISTS "current_chain_id";
    ALTER TABLE "user" DROP COLUMN IF EXISTS "preferred_chain_id";
  END IF;
END $$;
