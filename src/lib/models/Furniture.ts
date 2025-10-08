import mongoose, { Document, Schema } from 'mongoose';

export interface IFurniture extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  material: string;
  color: string;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FurnitureSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Furniture name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['sofa', 'chair', 'table', 'bed', 'cabinet', 'desk', 'shelf', 'other']
  },
  images: [{
    type: String,
    required: true
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
    }
  },
  material: {
    type: String,
    required: [true, 'Material is required'],
    enum: ['wood', 'metal', 'fabric', 'leather', 'plastic', 'glass', 'mixed']
  },
  color: {
    type: String,
    required: [true, 'Color is required']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
FurnitureSchema.index({ category: 1 });
FurnitureSchema.index({ price: 1 });
FurnitureSchema.index({ featured: 1 });
FurnitureSchema.index({ inStock: 1 });

export default mongoose.models.Furniture || mongoose.model<IFurniture>('Furniture', FurnitureSchema);