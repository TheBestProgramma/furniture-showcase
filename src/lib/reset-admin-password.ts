import connectDB from './mongodb';
import User from './models/User';

interface ResetPasswordData {
  email?: string;
  newPassword: string;
}

export async function resetAdminPassword(data: ResetPasswordData) {
  try {
    await connectDB();

    // Find admin user
    let admin;
    if (data.email) {
      admin = await User.findOne({ 
        email: data.email.toLowerCase(),
        role: 'admin'
      });
      
      if (!admin) {
        throw new Error(`No admin user found with email: ${data.email}`);
      }
    } else {
      // Find any admin user
      admin = await User.findOne({ role: 'admin' });
      
      if (!admin) {
        throw new Error('No admin user found in the database');
      }
    }

    // Update password (the pre-save hook will hash it automatically)
    admin.password = data.newPassword;
    await admin.save();

    // Return admin without password
    const { password, ...adminWithoutPassword } = admin.toObject();
    
    return {
      success: true,
      message: 'Admin password reset successfully',
      admin: adminWithoutPassword
    };
  } catch (error) {
    console.error('Error resetting admin password:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to reset admin password'
    };
  }
}

// CLI script to reset admin password
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: npx tsx src/lib/reset-admin-password.ts [email] <newPassword>');
    console.log('Example: npx tsx src/lib/reset-admin-password.ts admin@example.com newpassword123');
    console.log('Or: npx tsx src/lib/reset-admin-password.ts "" newpassword123 (to reset any admin)');
    process.exit(1);
  }

  const email = args[0] || undefined;
  const newPassword = args[1];

  if (!newPassword) {
    console.error('❌ New password is required');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.error('❌ Password must be at least 6 characters long');
    process.exit(1);
  }

  resetAdminPassword({ email, newPassword })
    .then((result) => {
      if (result.success) {
        console.log('✅', result.message);
        console.log('\nAdmin Details:');
        console.log('- Name:', result.admin?.name);
        console.log('- Email:', result.admin?.email);
        console.log('- Role:', result.admin?.role);
        console.log('- Updated:', result.admin?.updatedAt);
        console.log('\n✅ You can now login with this email and your new password!');
      } else {
        console.error('❌', result.message);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}


