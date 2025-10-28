import connectDB from './mongodb';
import User from './models/User';

interface CreateAdminData {
  name: string;
  email: string;
  password: string;
}

export async function createAdmin(adminData: CreateAdminData) {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminData.email.toLowerCase() },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      throw new Error('Admin user already exists');
    }

    // Create new admin user
    const admin = new User({
      name: adminData.name,
      email: adminData.email.toLowerCase(),
      password: adminData.password,
      role: 'admin',
      isActive: true
    });

    const savedAdmin = await admin.save();

    // Return admin without password
    const { password, ...adminWithoutPassword } = savedAdmin.toObject();
    
    return {
      success: true,
      message: 'Admin user created successfully',
      admin: adminWithoutPassword
    };
  } catch (error) {
    console.error('Error creating admin:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create admin user'
    };
  }
}

// CLI script to create admin
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: npx tsx src/lib/create-admin.ts <name> <email> <password>');
    console.log('Example: npx tsx src/lib/create-admin.ts "Admin User" admin@example.com password123');
    process.exit(1);
  }

  const [name, email, password] = args;

  createAdmin({ name, email, password })
    .then((result) => {
      if (result.success) {
        console.log('✅', result.message);
        console.log('Admin Details:');
        console.log('- Name:', result.admin?.name);
        console.log('- Email:', result.admin?.email);
        console.log('- Role:', result.admin?.role);
        console.log('- Created:', result.admin?.createdAt);
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

