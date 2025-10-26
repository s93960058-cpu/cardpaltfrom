/*
  # Add Phone Verification System

  1. New Tables
    - `phone_verifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `phone_number` (text) - The phone number to verify
      - `verification_code` (text) - 6-digit code sent via SMS
      - `is_verified` (boolean) - Whether the code was verified
      - `expires_at` (timestamptz) - When the code expires (10 minutes)
      - `attempts` (integer) - Number of verification attempts
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on `phone_verifications` table
    - Users can only access their own verification records
    - Codes expire after 10 minutes
    - Maximum 3 verification attempts per code

  3. Changes to existing tables
    - Add `phone_verified` column to profiles
    - Add `phone_verified_at` column to profiles
*/

-- Create phone verifications table
CREATE TABLE IF NOT EXISTS phone_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  phone_number text NOT NULL,
  verification_code text NOT NULL,
  is_verified boolean DEFAULT false NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Add phone verification columns to profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_verified boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_verified_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_verified_at timestamptz;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE phone_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for phone_verifications
CREATE POLICY "Users can view own verifications"
  ON phone_verifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own verifications"
  ON phone_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own verifications"
  ON phone_verifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_phone_verifications_user_id 
  ON phone_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone 
  ON phone_verifications(phone_number);

-- Function to clean up expired verifications (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS void AS $$
BEGIN
  DELETE FROM phone_verifications
  WHERE expires_at < now() AND is_verified = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
