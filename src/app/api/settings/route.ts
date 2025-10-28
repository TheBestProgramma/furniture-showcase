import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export async function GET(request: NextRequest) {
  try {
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
          phone: '+1 (555) 123-4567',
          address: {
            street: '123 Furniture Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          }
        },
        socialMedia: {
          facebook: 'https://facebook.com/furnitureshowcase',
          instagram: 'https://instagram.com/furnitureshowcase',
          twitter: 'https://twitter.com/furnitureshowcase'
        },
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
          freeShippingThreshold: 100,
          standardShippingRate: 15,
          expressShippingRate: 25,
          internationalShippingRate: 50,
          processingTime: 2
        },
        tax: {
          enabled: true,
          rate: 8.5,
          includeInPrice: false
        },
        currency: {
          code: 'USD',
          symbol: '$',
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

    // Response data
    const response = {
      success: true,
      data: {
        settings
      }
    };

    return NextResponse.json(response);

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

// PUT method for updating settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const updateData = await request.json();

    // Find existing settings or create new one
    let settings = await Settings.findOne();

    if (settings) {
      // Update existing settings
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          settings[key] = updateData[key];
        }
      });
      
      await settings.save();
    } else {
      // Create new settings
      settings = new Settings(updateData);
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


