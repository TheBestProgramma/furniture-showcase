#!/usr/bin/env node

/**
 * Script to reset admin password
 * Usage: node scripts/reset-admin-password.js [email] [newPassword]
 * Or run interactively: node scripts/reset-admin-password.js
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

async function resetAdminPassword() {
  console.log('🔐 Furniture Showcase - Admin Password Reset');
  console.log('============================================\n');

  try {
    let email, newPassword;

    // Check if arguments were provided
    const args = process.argv.slice(2);
    
    if (args.length >= 2) {
      email = args[0];
      newPassword = args[1];
    } else {
      // Interactive mode
      email = await question('Admin Email (or press Enter to find any admin): ');
      newPassword = await question('New Password (min 6 characters): ');
    }

    if (!newPassword) {
      console.log('❌ Password is required');
      process.exit(1);
    }

    if (newPassword.length < 6) {
      console.log('❌ Password must be at least 6 characters long');
      process.exit(1);
    }

    console.log('\n⏳ Resetting admin password...');

    // Run the reset script
    const emailArg = email ? `"${email}"` : '""';
    const command = `npx tsx src/lib/reset-admin-password.ts ${emailArg} "${newPassword}"`;
    execSync(command, { stdio: 'inherit' });

    console.log('\n✅ Password reset completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Visit: http://localhost:3000/admin/login');
    console.log('2. Login with your admin email and new password');

  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

resetAdminPassword();

