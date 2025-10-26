import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agzeqhesddulsetepgcc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnemVxaGVzZGR1bHNldGVwZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTY2MzcsImV4cCI6MjA3NjM5MjYzN30.9ed902wKVxoCNqxmBxPk7cv5ufD5oH8YJOU0FPIdtxA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log('Creating admin user...');

  // Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'shay053713@gmail.com',
    password: '555333111',
  });

  if (authError) {
    console.error('Auth error:', authError.message);
    return;
  }

  if (!authData.user) {
    console.error('No user data returned');
    return;
  }

  console.log('User created with ID:', authData.user.id);

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: 'shay053713@gmail.com',
      full_name: 'Admin User',
      plan: 'enterprise',
      status: 'active',
    });

  if (profileError) {
    console.error('Profile error:', profileError.message);
    return;
  }

  console.log('✅ Admin user created successfully!');
  console.log('Email: shay053713@gmail.com');
  console.log('Password: 555333111');
  console.log('Plan: Enterprise');
  console.log('');
  console.log('You can now login at: http://localhost:5173/login');
}

createAdminUser();
