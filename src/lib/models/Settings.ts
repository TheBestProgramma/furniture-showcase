import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  siteLogo: string;
  siteFavicon: string;
  contactInfo: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingRate: number;
    expressShippingRate: number;
    internationalShippingRate: number;
    processingTime: number; // in days
  };
  tax: {
    enabled: boolean;
    rate: number; // percentage
    includeInPrice: boolean;
  };
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    ogImage: string;
  };
  features: {
    wishlist: boolean;
    reviews: boolean;
    compare: boolean;
    newsletter: boolean;
    blog: boolean;
    maintenanceMode: boolean;
  };
  notifications: {
    email: {
      orderConfirmation: boolean;
      orderShipped: boolean;
      orderDelivered: boolean;
      lowStock: boolean;
      newCustomer: boolean;
    };
    sms: {
      orderConfirmation: boolean;
      orderShipped: boolean;
      orderDelivered: boolean;
    };
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    hotjarId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true,
    maxlength: [100, 'Site name cannot be more than 100 characters']
  },
  siteDescription: {
    type: String,
    required: [true, 'Site description is required'],
    trim: true,
    maxlength: [500, 'Site description cannot be more than 500 characters']
  },
  siteLogo: {
    type: String,
    required: [true, 'Site logo is required']
  },
  siteFavicon: {
    type: String,
    required: [true, 'Site favicon is required']
  },
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot be more than 20 characters']
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
        maxlength: [200, 'Street address cannot be more than 200 characters']
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [50, 'City cannot be more than 50 characters']
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        maxlength: [50, 'State cannot be more than 50 characters']
      },
      zipCode: {
        type: String,
        required: [true, 'ZIP code is required'],
        trim: true,
        maxlength: [10, 'ZIP code cannot be more than 10 characters']
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        maxlength: [50, 'Country cannot be more than 50 characters']
      }
    }
  },
  socialMedia: {
    facebook: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    }
  },
  businessHours: {
    monday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false }
    },
    tuesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false }
    },
    wednesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false }
    },
    thursday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false }
    },
    friday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '17:00' },
      closed: { type: Boolean, default: false }
    },
    saturday: {
      open: { type: String, default: '10:00' },
      close: { type: String, default: '16:00' },
      closed: { type: Boolean, default: false }
    },
    sunday: {
      open: { type: String, default: '10:00' },
      close: { type: String, default: '16:00' },
      closed: { type: Boolean, default: true }
    }
  },
  shipping: {
    freeShippingThreshold: {
      type: Number,
      default: 100,
      min: [0, 'Free shipping threshold cannot be negative']
    },
    standardShippingRate: {
      type: Number,
      default: 15,
      min: [0, 'Shipping rate cannot be negative']
    },
    expressShippingRate: {
      type: Number,
      default: 25,
      min: [0, 'Express shipping rate cannot be negative']
    },
    internationalShippingRate: {
      type: Number,
      default: 50,
      min: [0, 'International shipping rate cannot be negative']
    },
    processingTime: {
      type: Number,
      default: 2,
      min: [0, 'Processing time cannot be negative']
    }
  },
  tax: {
    enabled: {
      type: Boolean,
      default: true
    },
    rate: {
      type: Number,
      default: 8.5,
      min: [0, 'Tax rate cannot be negative'],
      max: [100, 'Tax rate cannot exceed 100%']
    },
    includeInPrice: {
      type: Boolean,
      default: false
    }
  },
  currency: {
    code: {
      type: String,
      default: 'USD',
      trim: true,
      uppercase: true,
      maxlength: [3, 'Currency code cannot be more than 3 characters']
    },
    symbol: {
      type: String,
      default: '$',
      trim: true,
      maxlength: [5, 'Currency symbol cannot be more than 5 characters']
    },
    position: {
      type: String,
      default: 'before',
      enum: ['before', 'after']
    }
  },
  seo: {
    metaTitle: {
      type: String,
      required: [true, 'Meta title is required'],
      trim: true,
      maxlength: [60, 'Meta title cannot be more than 60 characters']
    },
    metaDescription: {
      type: String,
      required: [true, 'Meta description is required'],
      trim: true,
      maxlength: [160, 'Meta description cannot be more than 160 characters']
    },
    metaKeywords: [{
      type: String,
      trim: true
    }],
    ogImage: {
      type: String,
      required: [true, 'Open Graph image is required']
    }
  },
  features: {
    wishlist: {
      type: Boolean,
      default: true
    },
    reviews: {
      type: Boolean,
      default: true
    },
    compare: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    },
    blog: {
      type: Boolean,
      default: true
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    }
  },
  notifications: {
    email: {
      orderConfirmation: {
        type: Boolean,
        default: true
      },
      orderShipped: {
        type: Boolean,
        default: true
      },
      orderDelivered: {
        type: Boolean,
        default: true
      },
      lowStock: {
        type: Boolean,
        default: true
      },
      newCustomer: {
        type: Boolean,
        default: true
      }
    },
    sms: {
      orderConfirmation: {
        type: Boolean,
        default: false
      },
      orderShipped: {
        type: Boolean,
        default: false
      },
      orderDelivered: {
        type: Boolean,
        default: false
      }
    }
  },
  analytics: {
    googleAnalyticsId: {
      type: String,
      trim: true
    },
    facebookPixelId: {
      type: String,
      trim: true
    },
    hotjarId: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Create indexes
SettingsSchema.index({ createdAt: -1 });

// Virtual for business hours summary
SettingsSchema.virtual('businessHoursSummary').get(function() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const openDays = days.filter(day => !this.businessHours[day].closed);
  return {
    openDays,
    totalOpenDays: openDays.length,
    isOpenToday: this.isOpenToday()
  };
});

// Virtual for shipping options
SettingsSchema.virtual('shippingOptions').get(function() {
  return [
    {
      name: 'Standard Shipping',
      rate: this.shipping.standardShippingRate,
      estimatedDays: this.shipping.processingTime + 3
    },
    {
      name: 'Express Shipping',
      rate: this.shipping.expressShippingRate,
      estimatedDays: this.shipping.processingTime + 1
    },
    {
      name: 'International Shipping',
      rate: this.shipping.internationalShippingRate,
      estimatedDays: this.shipping.processingTime + 7
    }
  ];
});

// Method to check if business is open today
SettingsSchema.methods.isOpenToday = function() {
  const today = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[today.getDay()];
  return !this.businessHours[dayName]?.closed;
};

// Method to get current business status
SettingsSchema.methods.getBusinessStatus = function() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = dayNames[now.getDay()];
  
  const todayHours = this.businessHours[today];
  if (todayHours.closed) {
    return { status: 'closed', message: 'Closed today' };
  }
  
  if (currentTime >= todayHours.open && currentTime <= todayHours.close) {
    return { status: 'open', message: 'Open now' };
  }
  
  return { status: 'closed', message: 'Closed for today' };
};

// Ensure virtual fields are serialized
SettingsSchema.set('toJSON', { virtuals: true });
SettingsSchema.set('toObject', { virtuals: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
