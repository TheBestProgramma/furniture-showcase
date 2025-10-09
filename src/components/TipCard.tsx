'use client';

import Link from 'next/link';
import { Tip } from '@/lib/types/tips';

interface TipCardProps {
  tip: Tip;
}

export default function TipCard({ tip }: TipCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
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
    <Link
      href={`/tips/${tip.slug}`}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={tip.image}
          alt={tip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Overlay elements */}
        <div className="absolute top-3 left-3 rounded-full overflow-hidden">
          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium block ${getCategoryColor(tip.category.color)}`}
            style={{ 
              border: 'none', 
              outline: 'none',
              boxShadow: 'none'
            }}
          >
            <span>{tip.category.icon}</span>
            {tip.category.name}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 rounded-full overflow-hidden">
          {tip.featured && (
            <span className="bg-yellow-500 text-yellow-900 px-2 py-1 text-xs font-medium block"
              style={{ 
                border: 'none', 
                outline: 'none',
                boxShadow: 'none'
              }}
            >
              Featured
            </span>
          )}
        </div>
        
        <div className="absolute bottom-3 right-3">
          <span className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            {tip.readTime} min read
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {tip.title}
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            {tip.category.name}
          </p>
        </div>

        <p className="text-gray-700 text-sm mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {tip.excerpt}
        </p>

        {/* Tip Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Author:</span>
            <span className="text-gray-900">{tip.author}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Read Time:</span>
            <span className="text-gray-900">{tip.readTime} min</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Published:</span>
            <span className="text-gray-900 text-xs">
              {formatDate(tip.createdAt)}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tip.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {tip.tags.length > 3 && (
            <span className="text-gray-400 text-xs px-2 py-1">
              +{tip.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-gray-600 flex-shrink-0">
            {tip.readTime} min read
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-shrink-0"
          >
            Read More
          </button>
        </div>
      </div>
    </Link>
  );
}
