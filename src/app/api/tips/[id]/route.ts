import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tip from '@/lib/models/Tip';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid tip ID format' 
        },
        { status: 400 }
      );
    }

    // Find tip by ID
    const tip = await Tip.findById(id).lean();

    if (!tip) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tip not found' 
        },
        { status: 404 }
      );
    }

    // Increment view count
    await Tip.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Get related tips (same category, excluding current tip)
    const relatedTips = await Tip.find({
      category: tip.category,
      _id: { $ne: tip._id },
      published: true
    })
      .sort({ featured: -1, publishedAt: -1 })
      .limit(3)
      .select('title slug excerpt image readTime views likes category author publishedAt')
      .lean();

    // Response data
    const response = {
      success: true,
      data: {
        tip: {
          ...tip,
          views: tip.views + 1 // Include the incremented view count
        },
        relatedTips
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching tip:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch tip',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT method for updating tips (admin only - for future implementation)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const updateData = await request.json();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid tip ID format' 
        },
        { status: 400 }
      );
    }

    // Update tip
    const tip = await Tip.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!tip) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tip not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tip
    });

  } catch (error) {
    console.error('Error updating tip:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update tip',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE method for deleting tips (admin only - for future implementation)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid tip ID format' 
        },
        { status: 400 }
      );
    }

    // Delete tip
    const tip = await Tip.findByIdAndDelete(id);

    if (!tip) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tip not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tip deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tip:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete tip',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
