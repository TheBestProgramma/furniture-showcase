import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: mongoose.Types.ObjectId;
  subcategory?: string;
  images: string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
    weight?: number;
  };
  material: string[];
  color: string;
  brand?: string;
  productModel?: string;
  sku: string;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  onSale: boolean;
  discountPercentage?: number;
  tags: string[];
  specifications: {
    [key: string]: string | number;
  };
  rating: {
    average: number;
    count: number;
  };
  reviews: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  dimensions: {
    width: {
      type: Number,
      required: true,
      min: [0, 'Width cannot be negative']
    },
    height: {
      type: Number,
      required: true,
      min: [0, 'Height cannot be negative']
    },
    depth: {
      type: Number,
      required: true,
      min: [0, 'Depth cannot be negative']
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    }
  },
  material: [{
    type: String,
    required: [true, 'At least one material is required'],
    enum: ['wood', 'metal', 'fabric', 'leather', 'plastic', 'glass', 'ceramic', 'stone', 'mixed']
  }],
  color: {
    type: String,
    required: [true, 'Color is required']
  },
  brand: {
    type: String,
    trim: true
  },
  productModel: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount percentage cannot be negative'],
    max: [100, 'Discount percentage cannot exceed 100']
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: Schema.Types.Mixed
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

// Create indexes for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ onSale: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ 'rating.average': -1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

// Virtual for sale price calculation
ProductSchema.virtual('salePrice').get(function() {
  if (this.onSale && this.discountPercentage) {
    return (this.price as number) * (1 - (this.discountPercentage as number) / 100);
  }
  return this.price;
});

// Ensure virtual fields are serialized
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
