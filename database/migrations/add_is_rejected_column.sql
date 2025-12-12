-- =====================================================
-- ADD is_rejected COLUMN TO Profiles TABLE
-- =====================================================
-- This allows tracking rejected profiles separately from pending ones
-- Pending: is_approved = false AND is_rejected = false
-- Approved: is_approved = true AND is_rejected = false
-- Rejected: is_approved = false AND is_rejected = true
-- =====================================================

ALTER TABLE public."Profiles"
  ADD COLUMN IF NOT EXISTS is_rejected boolean NOT NULL DEFAULT false;

-- Optional: Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status 
  ON public."Profiles" (is_approved, is_rejected);

-- Verification
SELECT 
  COUNT(*) FILTER (WHERE is_approved = false AND is_rejected = false) as pending,
  COUNT(*) FILTER (WHERE is_approved = true) as approved,
  COUNT(*) FILTER (WHERE is_rejected = true) as rejected
FROM public."Profiles";
