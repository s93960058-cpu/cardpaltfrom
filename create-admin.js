import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YmFzcmF3a295Y3R0emFhYW9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc4NDU1MiwiZXhwIjoyMDY5MzYwNTUyfQ.uBNxKqv4Gxh3PuIgbVhSm_QzDaBaE4aYJNs0JMLF3tM';

console.log('Creating admin user...');
console.log('Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  try {
    const adminEmail = 'admin@cardlink.co.il';
    const adminPassword = 'Admin123!@#';

    console.log(`\n1. Creating auth user: ${adminEmail}`);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin User'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists in auth.users, updating profile...');

        const { data: existingUser } = await supabase.auth.admin.listUsers();
        const user = existingUser.users.find(u => u.email === adminEmail);

        if (user) {
          console.log(`Found existing user with ID: ${user.id}`);

          const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: adminEmail,
              full_name: 'Admin User',
              role: 'admin',
              plan: 'enterprise',
              status: 'active'
            }, {
              onConflict: 'id'
            });

          if (updateError) {
            console.error('Error updating profile:', updateError);
            return;
          }

          console.log('✅ Admin profile updated successfully!');
          console.log('\nAdmin Credentials:');
          console.log('Email:', adminEmail);
          console.log('Password:', adminPassword);
          console.log('Role: admin');
          return;
        }
      } else {
        console.error('Error creating auth user:', authError);
        return;
      }
    }

    console.log('✅ Auth user created:', authData.user.id);

    console.log('\n2. Creating profile with admin role...');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        full_name: 'Admin User',
        role: 'admin',
        plan: 'enterprise',
        status: 'active'
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return;
    }

    console.log('✅ Admin profile created successfully!');
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ADMIN USER CREATED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('\nAdmin Credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role: admin');
    console.log('Plan: enterprise');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdmin();
