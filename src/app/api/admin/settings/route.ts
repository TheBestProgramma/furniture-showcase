import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

// GET settings (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin access required' 
        },
        { status: 403 }
      );
    }

    await connectDB();

    // Get settings (there should only be one settings document)
    let settings = await Settings.findOne().lean();

    // If no settings exist, create default settings
    if (!settings) {
      const defaultSettings = new Settings({
        siteName: 'Furniture Showcase',
        siteDescription: 'Premium furniture for your home and office',
        siteLogo: '/images/logo.png',
        siteFavicon: '/images/favicon.ico',
        contactInfo: {
          email: 'info@furnitureshowcase.com',
          phone: '+254712345678',
          address: {
            street: '123 Furniture Street',
            city: 'Nairobi',
            state: 'Nairobi',
            zipCode: '00100',
            country: 'Kenya'
          }
        },
        whatsappPhone: '+254712345678',
        returnPolicy: 'We offer a 30-day return policy for unused items in original packaging. Custom furniture and personalized items are not eligible for returns. Please contact us for return instructions.',
        socialMedia: {},
        businessHours: {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '10:00', close: '16:00', closed: false },
          sunday: { open: '10:00', close: '16:00', closed: true }
        },
        shipping: {
          freeShippingThreshold: 100000,
          standardShippingRate: 15000,
          expressShippingRate: 25000,
          internationalShippingRate: 50000,
          processingTime: 2
        },
        tax: {
          enabled: true,
          rate: 16,
          includeInPrice: false
        },
        currency: {
          code: 'KES',
          symbol: 'KSh',
          position: 'before'
        },
        seo: {
          metaTitle: 'Furniture Showcase - Premium Home & Office Furniture',
          metaDescription: 'Discover our collection of premium furniture for your home and office. Quality pieces for every space and style.',
          metaKeywords: ['furniture', 'home decor', 'office furniture', 'premium quality'],
          ogImage: '/images/og-image.jpg'
        },
        features: {
          wishlist: true,
          reviews: true,
          compare: true,
          newsletter: true,
          blog: true,
          maintenanceMode: false
        },
        notifications: {
          email: {
            orderConfirmation: true,
            orderShipped: true,
            orderDelivered: true,
            lowStock: true,
            newCustomer: true
          },
          sms: {
            orderConfirmation: false,
            orderShipped: false,
            orderDelivered: false
          }
        }
      });

      await defaultSettings.save();
      settings = defaultSettings.toObject();
    }

    return NextResponse.json({
      success: true,
      data: {
        settings
      }
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin access required' 
        },
        { status: 403 }
      );
    }

    await connectDB();

    const updateData = await request.json();

    // Find existing settings or create new one
    let settings = await Settings.findOne();

    if (settings) {
      // Update existing settings - handle nested objects properly
      if (updateData.siteName !== undefined) settings.siteName = updateData.siteName;
      if (updateData.siteDescription !== undefined) settings.siteDescription = updateData.siteDescription;
      if (updateData.whatsappPhone !== undefined) {
        settings.whatsappPhone = updateData.whatsappPhone;
        // Also update contactInfo.phone if it exists
        if (settings.contactInfo) {
          settings.contactInfo.phone = updateData.whatsappPhone;
        }
      }
      if (updateData.returnPolicy !== undefined) settings.returnPolicy = updateData.returnPolicy;
      
      // Update nested objects if provided
      if (updateData.contactInfo) {
        if (!settings.contactInfo) {
          settings.contactInfo = updateData.contactInfo;
        } else {
          Object.keys(updateData.contactInfo).forEach(key => {
            if (updateData.contactInfo[key] !== undefined) {
              settings.contactInfo[key] = updateData.contactInfo[key];
            }
          });
        }
      }
      
      await settings.save();
    } else {
      // Create new settings with provided data and defaults
      settings = new Settings({
        ...updateData,
        // Set required fields if not provided
        siteLogo: updateData.siteLogo || '/images/logo.png',
        siteFavicon: updateData.siteFavicon || '/images/favicon.ico',
        contactInfo: updateData.contactInfo || {
          email: 'info@furnitureshowcase.com',
          phone: updateData.whatsappPhone || '+254712345678',
          address: {
            street: '123 Furniture Street',
            city: 'Nairobi',
            state: 'Nairobi',
            zipCode: '00100',
            country: 'Kenya'
          }
        },
        seo: updateData.seo || {
          metaTitle: 'Furniture Showcase - Premium Home & Office Furniture',
          metaDescription: 'Discover our collection of premium furniture for your home and office.',
          metaKeywords: ['furniture', 'home decor'],
          ogImage: '/images/og-image.jpg'
        }
      });
      await settings.save();
    }

    const settingsData = settings.toObject ? settings.toObject() : settings;

    return NextResponse.json({
      success: true,
      data: {
        settings: settingsData
      },
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    
    // Extract detailed error message
    let errorMessage = 'Failed to update settings';
    let detailedMessage = 'Unknown error';
    
    if (error instanceof Error) {
      detailedMessage = error.message;
      // Check if it's a MongoDB validation error
      if (error.name === 'ValidationError' && (error as any).errors) {
        const validationErrors = Object.values((error as any).errors)
          .map((err: any) => err.message)
          .join(', ');
        errorMessage = `Validation error: ${validationErrors}`;
        detailedMessage = validationErrors;
      } else if (error.message) {
        errorMessage = error.message;
        detailedMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: detailedMessage,
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error instanceof Error ? error.stack : undefined 
        })
      },
      { status: 500 }
    );
  }
}

