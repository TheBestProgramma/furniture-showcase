import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';
import mongoose from 'mongoose';

// GET single testimonial by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid testimonial ID format' 
        },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findById(id).lean();

    if (!testimonial) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Testimonial not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial
    });

  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch testimonial',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update testimonial (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const updateData = await request.json();

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid testimonial ID format' 
        },
        { status: 400 }
      );
    }

    // Validate status updates
    const allowedStatuses = ['pending', 'approved', 'rejected'];
    if (updateData.status && !allowedStatuses.includes(updateData.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid status. Must be one of: pending, approved, rejected' 
        },
        { status: 400 }
      );
    }

    // Validate rating
    if (updateData.rating !== undefined) {
      if (updateData.rating < 1 || updateData.rating > 5) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Rating must be between 1 and 5' 
          },
          { status: 400 }
        );
      }
    }

    // Update testimonial
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Testimonial not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
      message: 'Testimonial updated successfully'
    });

  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update testimonial',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete testimonial (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid testimonial ID format' 
        },
        { status: 400 }
      );
    }

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Testimonial not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete testimonial',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

