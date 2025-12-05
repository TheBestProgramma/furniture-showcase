import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  location: string;
  rating: number; // 1-5 stars
  text: string;
  image?: string; // Optional customer photo
  product?: string; // Optional product they purchased
  verified: boolean; // Whether the purchase was verified
  featured: boolean; // Whether to show in featured section
  status: 'pending' | 'approved' | 'rejected'; // Admin approval status
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  text: {
    type: String,
    required: [true, 'Testimonial text is required'],
    trim: true,
    minlength: [10, 'Testimonial text must be at least 10 characters'],
    maxlength: [1000, 'Testimonial text cannot be more than 1000 characters']
  },
  image: {
    type: String,
    trim: true
  },
  product: {
    type: String,
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
TestimonialSchema.index({ status: 1 });
TestimonialSchema.index({ featured: 1 });
TestimonialSchema.index({ verified: 1 });
TestimonialSchema.index({ rating: -1 });
TestimonialSchema.index({ createdAt: -1 });
TestimonialSchema.index({ name: 'text', text: 'text', product: 'text' });

// Virtual for rating display
TestimonialSchema.virtual('ratingDisplay').get(function() {
  return {
    stars: '⭐'.repeat(this.rating),
    numeric: this.rating,
    text: `${this.rating} out of 5 stars`
  };
});

// Virtual for testimonial summary
TestimonialSchema.virtual('summary').get(function() {
  return {
    isVerified: this.verified,
    isFeatured: this.featured,
    isApproved: this.status === 'approved',
    displayText: this.text.length > 100 ? this.text.substring(0, 100) + '...' : this.text
  };
});

// Ensure virtual fields are serialized
TestimonialSchema.set('toJSON', { virtuals: true });
TestimonialSchema.set('toObject', { virtuals: true });

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

