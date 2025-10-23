import mongoose, { Document, Schema } from 'mongoose';

export interface ITip extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: Date;
  image: string;
  readTime: number; // in minutes
  views: number;
  likes: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TipSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Tip title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [100, 'Content must be at least 100 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'furniture-care',
      'home-decor',
      'space-planning',
      'maintenance',
      'styling',
      'buying-guide',
      'diy',
      'sustainability',
      'trends',
      'general'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },
  image: {
    type: String,
    required: [true, 'Tip image is required']
  },
  readTime: {
    type: Number,
    required: [true, 'Read time is required'],
    min: [1, 'Read time must be at least 1 minute'],
    max: [60, 'Read time cannot exceed 60 minutes']
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'SEO title cannot be more than 60 characters']
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'SEO description cannot be more than 160 characters']
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
TipSchema.index({ slug: 1 });
TipSchema.index({ category: 1 });
TipSchema.index({ published: 1 });
TipSchema.index({ featured: 1 });
TipSchema.index({ publishedAt: -1 });
TipSchema.index({ views: -1 });
TipSchema.index({ likes: -1 });
TipSchema.index({ tags: 1 });
TipSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Virtual for reading progress
TipSchema.virtual('readingProgress').get(function() {
  return {
    estimatedTime: this.readTime,
    difficulty: this.readTime <= 5 ? 'Quick Read' : 
               this.readTime <= 15 ? 'Medium Read' : 'Long Read'
  };
});

// Virtual for engagement metrics
TipSchema.virtual('engagement').get(function() {
  const totalInteractions = this.views + this.likes;
  return {
    totalInteractions,
    engagementRate: this.views > 0 ? (this.likes / this.views) * 100 : 0
  };
});

// Ensure virtual fields are serialized
TipSchema.set('toJSON', { virtuals: true });
TipSchema.set('toObject', { virtuals: true });

// Pre-save middleware to generate slug if not provided
TipSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Set publishedAt when publishing
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Pre-validate middleware to ensure slug is always generated
TipSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

export default mongoose.models.Tip || mongoose.model<ITip>('Tip', TipSchema);
