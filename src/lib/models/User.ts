import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'user'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Virtual for user display name
UserSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0];
});

// Virtual for user initials
UserSchema.virtual('initials').get(function() {
  const names = this.name.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return this.name[0].toUpperCase();
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Static method to find user by email
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to create admin user
UserSchema.statics.createAdmin = async function(adminData: {
  name: string;
  email: string;
  password: string;
}) {
  // Check if admin already exists
  const existingAdmin = await this.findOne({ 
    $or: [
      { email: adminData.email.toLowerCase() },
      { role: 'admin' }
    ]
  });

  if (existingAdmin) {
    throw new Error('Admin user already exists');
  }

  // Create new admin user
  const admin = new this({
    ...adminData,
    email: adminData.email.toLowerCase(),
    role: 'admin',
    isActive: true
  });

  return await admin.save();
};

// Static method to get admin users
UserSchema.statics.getAdmins = function() {
  return this.find({ role: 'admin', isActive: true }).select('-password');
};

// Static method to update last login
UserSchema.statics.updateLastLogin = function(userId: string) {
  return this.findByIdAndUpdate(
    userId,
    { lastLogin: new Date() },
    { new: true }
  );
};

// Pre-remove middleware to prevent deletion of last admin
UserSchema.pre('remove', async function(next) {
  if (this.role === 'admin') {
    const adminCount = await mongoose.model('User').countDocuments({ 
      role: 'admin', 
      isActive: true 
    });
    
    if (adminCount <= 1) {
      return next(new Error('Cannot delete the last admin user'));
    }
  }
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
