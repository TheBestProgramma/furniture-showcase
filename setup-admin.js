#!/usr/bin/env node

/**
 * Setup script to create the first admin user
 * Usage: node setup-admin.js
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAdmin() {
  console.log('🔧 Furniture Showcase - Admin Setup');
  console.log('=====================================\n');

  try {
    // Get admin details
    const name = await question('Admin Name: ');
    const email = await question('Admin Email: ');
    const password = await question('Admin Password (min 6 characters): ');

    if (!name || !email || !password) {
      console.log('❌ All fields are required');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters long');
      process.exit(1);
    }

    console.log('\n⏳ Creating admin user...');

    // Run the create-admin script
    const command = `npx tsx src/lib/create-admin.ts "${name}" "${email}" "${password}"`;
    execSync(command, { stdio: 'inherit' });

    console.log('\n✅ Admin setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Visit: http://localhost:3000/admin/login');
    console.log('3. Login with your admin credentials');
    console.log('4. Access the admin dashboard at: http://localhost:3000/admin/dashboard');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupAdmin();



