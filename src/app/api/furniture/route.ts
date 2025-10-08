import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Furniture from '@/lib/models/Furniture';

// GET - Fetch all furniture items
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    
    let query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    const furniture = await Furniture.find(query)
      .limit(limit ? parseInt(limit) : 50)
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: furniture,
      count: furniture.length
    });
  } catch (error) {
    console.error('Error fetching furniture:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error fetching furniture',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new furniture item
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const furniture = new Furniture(body);
    await furniture.save();
    
    return NextResponse.json({
      success: true,
      data: furniture,
      message: 'Furniture item created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating furniture:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error creating furniture',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

