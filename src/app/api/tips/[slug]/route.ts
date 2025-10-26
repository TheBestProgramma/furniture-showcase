import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tip from '@/lib/models/Tip';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    // Find tip by slug
    const tip = await Tip.findOne({ slug, published: true }).lean();

    if (!tip) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tip not found',
          message: 'The requested tip does not exist or is not published'
        },
        { status: 404 }
      );
    }

    const tipData = tip as any;
    
    return NextResponse.json({
      success: true,
      data: {
        tip: {
          _id: tipData._id,
          title: tipData.title,
          slug: tipData.slug,
          content: tipData.content,
          excerpt: tipData.excerpt,
          author: tipData.author,
          category: tipData.category,
          tags: tipData.tags,
          featured: tipData.featured,
          published: tipData.published,
          image: tipData.image,
          readTime: tipData.readTime,
          seoTitle: tipData.seoTitle,
          seoDescription: tipData.seoDescription,
          createdAt: tipData.createdAt,
          updatedAt: tipData.updatedAt,
          publishedAt: tipData.publishedAt
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tip:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch tip'
      },
      { status: 500 }
    );
  }
}
