import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwbasrawkoycttzaaaom.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3YmFzcmF3a295Y3R0emFhYW9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc4NDU1MiwiZXhwIjoyMDY5MzYwNTUyfQ.uBNxKqv4Gxh3PuIgbVhSm_QzDaBaE4aYJNs0JMLF3tM';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createShayAdmin() {
  try {
    const adminEmail = 'SHAY053713@GMAIL.COM';
    const adminPassword = '555333111';

    console.log(`Creating super admin user: ${adminEmail}`);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Shay - Super Admin'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists, finding and updating...');

        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const user = existingUsers.users.find(u => u.email?.toLowerCase() === adminEmail.toLowerCase());

        if (user) {
          console.log(`Found user with ID: ${user.id}`);

          const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: adminEmail,
              full_name: 'Shay - Super Admin',
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

          console.log('✅ Super Admin profile updated!');
          console.log('\n' + '='.repeat(60));
          console.log('🎉 SUPER ADMIN READY!');
          console.log('='.repeat(60));
          console.log('Email:', adminEmail);
          console.log('Password:', adminPassword);
          console.log('Role: ADMIN (FULL ACCESS)');
          console.log('='.repeat(60));
          return;
        }
      } else {
        console.error('Error creating user:', authError);
        return;
      }
    }

    console.log('✅ Auth user created:', authData.user.id);

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: adminEmail,
        full_name: 'Shay - Super Admin',
        role: 'admin',
        plan: 'enterprise',
        status: 'active'
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return;
    }

    console.log('✅ Super Admin profile created!');
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SUPER ADMIN CREATED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role: ADMIN (FULL ACCESS)');
    console.log('Plan: Enterprise (Unlimited)');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createShayAdmin();
