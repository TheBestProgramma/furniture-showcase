'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { useTip, useTips } from '@/hooks/useTips';
import TipCard from '@/components/TipCard';
import TipGridSkeleton from '@/components/TipGridSkeleton';

export default function TipDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Fetch the current tip
  const { tip, loading: tipLoading, error: tipError, refetch } = useTip(slug);
  
  
  // Fetch related tips from the same category
  const { tips: relatedTips, loading: relatedLoading } = useTips({
    category: tip?.category,
    limit: 3,
    published: true,
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });

  // Loading state
  if (tipLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6 md:p-8">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (tipError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tip</h1>
            <p className="text-gray-600 mb-6">{tipError}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={refetch}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <Link 
                href="/tips" 
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Tips
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!tip) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tip Not Found</h1>
            <p className="text-gray-600 mb-6">The tip you're looking for doesn't exist.</p>
            <Link 
              href="/tips" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Tips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(dateObj);
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
      pink: 'bg-pink-100 text-pink-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-gray-700">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/tips" className="hover:text-gray-700">Tips & Guides</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{tip.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden">
            <img
              src={typeof tip.image === 'string' ? tip.image : (tip.image as any)?.url}
              alt={typeof tip.image === 'string' ? tip.title : ((tip.image as any)?.alt || tip.title)}
              className="w-full h-full object-cover relative z-0"
              loading="lazy"
            />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10 rounded-full overflow-hidden">
              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800"
                style={{ 
                  border: 'none', 
                  outline: 'none',
                  boxShadow: 'none'
                }}
              >
                <span>📝</span>
                {tip.category}
              </span>
            </div>

            {/* Featured Badge */}
            {tip.featured && (
              <div className="absolute top-4 right-4 z-10 rounded-full overflow-hidden">
                <span className="bg-yellow-500 text-yellow-900 px-3 py-1 text-sm font-medium block"
                  style={{ 
                    border: 'none', 
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                >
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Title and Meta */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {tip.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>By {tip.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{tip.readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(tip.createdAt)}</span>
                </div>
              </div>

              {/* Excerpt */}
              <p className="text-lg text-gray-700 leading-relaxed">
                {tip.excerpt}
              </p>
            </header>

            {/* Tags */}
            {tip.tags && tip.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tip.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            )}

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-5">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 leading-relaxed">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-800">{children}</em>
                  ),
                }}
              >
                {tip.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Related Tips */}
        {relatedLoading && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tips</h2>
            <TipGridSkeleton count={3} columns={3} />
          </section>
        )}

        {!relatedLoading && relatedTips && relatedTips.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedTips.map((relatedTip) => (
                <Link
                  key={relatedTip._id}
                  href={`/tips/${relatedTip.slug}`}
                  className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-32 bg-gray-200 overflow-hidden">
                    <img
                      src={typeof relatedTip.image === 'string' ? relatedTip.image : (relatedTip.image as any)?.url}
                      alt={typeof relatedTip.image === 'string' ? relatedTip.title : ((relatedTip.image as any)?.alt || relatedTip.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedTip.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {relatedTip.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{relatedTip.readTime} min read</span>
                      <span>{formatDate(new Date(relatedTip.createdAt))}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Tips */}
        <div className="mt-8 text-center">
          <Link 
            href="/tips" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Tips
          </Link>
        </div>
      </div>
    </div>
  );
}
