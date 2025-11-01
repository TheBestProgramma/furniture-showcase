import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Tip from '@/lib/models/Tip';

// GET single tip by ID (admin)
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
    const tip = await Tip.findById(id);

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

// PUT - Update tip (admin only)
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

    const body = await request.json();
    const { 
      title,
      slug,
      content, 
      excerpt, 
      author, 
      category, 
      tags, 
      featured, 
      published, 
      image, 
      readTime, 
      seoTitle, 
      seoDescription 
    } = body;

    const tip = await Tip.findById(id);

    if (!tip) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tip not found' 
        },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if new slug already exists
    const newSlug = slug || tip.slug;
    if (slug && slug !== tip.slug) {
      const existingTip = await Tip.findOne({ slug: newSlug, _id: { $ne: id } });
      if (existingTip) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'A tip with this slug already exists' 
          },
          { status: 400 }
        );
      }
    }

    // Update tip fields
    if (title !== undefined) tip.title = title;
    if (slug !== undefined) tip.slug = slug;
    if (content !== undefined) {
      if (content.trim().length < 100) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Content must be at least 100 characters' 
          },
          { status: 400 }
        );
      }
      tip.content = content;
    }
    if (excerpt !== undefined) tip.excerpt = excerpt;
    if (author !== undefined) tip.author = author;
    if (category !== undefined) tip.category = category;
    if (tags !== undefined) tip.tags = tags;
    if (featured !== undefined) tip.featured = featured;
    
    // Handle publish/unpublish
    const wasPublished = tip.published;
    if (published !== undefined) {
      tip.published = published;
      
      // Set publishedAt when publishing for the first time
      if (published && !wasPublished && !tip.publishedAt) {
        tip.publishedAt = new Date();
      }
      // Optionally clear publishedAt when unpublishing
      if (!published && wasPublished) {
        // Keep publishedAt for historical reference, or clear it:
        // tip.publishedAt = null;
      }
    }
    
    if (image !== undefined) {
      tip.image = {
        url: image.url,
        alt: image.alt || tip.title,
        width: image.width,
        height: image.height
      };
    }
    if (readTime !== undefined) tip.readTime = readTime;
    if (seoTitle !== undefined) tip.seoTitle = seoTitle;
    if (seoDescription !== undefined) tip.seoDescription = seoDescription;

    await tip.save();

    return NextResponse.json({
      success: true,
      data: tip,
      message: 'Tip updated successfully'
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

// DELETE - Delete tip (admin only)
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
    const tip = await Tip.findById(id);

    if (!tip) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tip not found' 
        },
        { status: 404 }
      );
    }

    await Tip.findByIdAndDelete(id);

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

