/*
  # Create Admin User - Simple Approach

  This migration creates an admin user profile.
  The actual auth user must be created via Supabase Dashboard.

  ## Instructions
  1. Go to Supabase Dashboard → Authentication → Users
  2. Click "Add user" → "Create new user"
  3. Email: admin@cardlink.co.il
  4. Password: Admin123!@#
  5. Auto Confirm: YES (check the box!)
  6. After creating, this migration will set the role to admin

  Or run: node create-admin.js
*/

-- Create a function to find and update admin user
CREATE OR REPLACE FUNCTION ensure_admin_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_id uuid;
BEGIN
  -- Try to find user by email in auth.users
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'admin@cardlink.co.il'
  LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Update or insert profile with admin role
    INSERT INTO profiles (id, email, full_name, role, plan, status, created_at, updated_at)
    VALUES (
      admin_id,
      'admin@cardlink.co.il',
      'Admin User',
      'admin',
      'enterprise',
      'active',
      now(),
      now()
    )
    ON CONFLICT (id)
    DO UPDATE SET
      role = 'admin',
      plan = 'enterprise',
      status = 'active',
      updated_at = now();

    RAISE NOTICE 'Admin user profile created/updated for ID: %', admin_id;
  ELSE
    RAISE NOTICE 'No auth user found with email admin@cardlink.co.il';
    RAISE NOTICE 'Please create the user first in Authentication → Users';
  END IF;
END;
$$;

-- Try to create admin profile if user exists
SELECT ensure_admin_role();

-- Note: If the user doesn't exist yet, you can run this function later:
-- SELECT ensure_admin_role();
