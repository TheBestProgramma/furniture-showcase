'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getTipBySlug, mockTips, tipCategories } from '@/lib/types/tips';
import { Tip } from '@/lib/types/tips';

export default function TipDetailPage() {
  const params = useParams();
  const [tip, setTip] = useState<Tip | null>(null);
  const [relatedTips, setRelatedTips] = useState<Tip[]>([]);

  useEffect(() => {
    if (params.slug) {
      const foundTip = getTipBySlug(params.slug as string);
      setTip(foundTip || null);
      
      // Get related tips from the same category
      if (foundTip) {
        const related = mockTips
          .filter(t => t.id !== foundTip.id && t.category.slug === foundTip.category.slug)
          .slice(0, 3);
        setRelatedTips(related);
      }
    }
  }, [params.slug]);

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
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
              src={tip.image}
              alt={tip.title}
              className="w-full h-full object-cover relative z-0"
              loading="lazy"
            />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10 rounded-full overflow-hidden">
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium block ${getCategoryColor(tip.category.color)}`}
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

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              {tip.slug === 'clean-maintain-wooden-furniture' ? (
                <div className="space-y-8">
                  {/* Introduction */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Wooden furniture is a timeless investment that can last for generations when properly cared for. 
                      Whether you have antique heirlooms or modern pieces, understanding how to clean and maintain 
                      wooden furniture is essential for preserving its beauty and functionality.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      This comprehensive guide will walk you through everything you need to know about wooden furniture 
                      care, from daily cleaning routines to seasonal maintenance tasks.
                    </p>
                  </section>

                  {/* Understanding Wood Types */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Different Wood Types</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Before diving into cleaning methods, it's important to understand that different wood types 
                      require different care approaches:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Hardwoods</h3>
                        <p className="text-gray-700 text-sm">
                          Oak, maple, cherry, walnut - These are durable and can handle more aggressive cleaning methods.
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Softwoods</h3>
                        <p className="text-gray-700 text-sm">
                          Pine, cedar, fir - More delicate and require gentler cleaning approaches.
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            <strong>Pro Tip:</strong> Always test any cleaning solution on an inconspicuous area first to ensure it won't damage the finish.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Daily Cleaning */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Cleaning Routine</h2>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Dusting</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Regular dusting is the foundation of wooden furniture care. Dust can scratch surfaces and 
                      create a dull appearance over time.
                    </p>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">What You'll Need:</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li>Microfiber cloth or soft cotton rag</li>
                        <li>Feather duster (for delicate pieces)</li>
                        <li>Vacuum with brush attachment</li>
                      </ul>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <p className="text-gray-700">
                            <strong>Start with dry dusting:</strong> Use a microfiber cloth to gently remove surface dust. 
                            Work in the direction of the wood grain to avoid scratching.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <p className="text-gray-700">
                            <strong>Use a vacuum for crevices:</strong> For detailed carvings or hard-to-reach areas, 
                            use a vacuum with a soft brush attachment.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <p className="text-gray-700">
                            <strong>Don't forget the underside:</strong> Dust the bottom of tables and chairs to prevent 
                            dust from settling on the floor and being tracked back up.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Weekly Cleaning */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Weekly Deep Cleaning</h2>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Gentle Cleaning Solutions</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      For weekly maintenance, you'll want to use a gentle cleaning solution that removes grime 
                      without damaging the wood finish.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">Homemade Solution</h4>
                        <ul className="text-green-800 text-sm space-y-1">
                          <li>• 1/4 cup white vinegar</li>
                          <li>• 1/4 cup olive oil</li>
                          <li>• 2 cups warm water</li>
                          <li>• 10 drops lemon essential oil (optional)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Commercial Products</h4>
                        <ul className="text-blue-800 text-sm space-y-1">
                          <li>• Murphy Oil Soap</li>
                          <li>• Pledge Wood Cleaner</li>
                          <li>• Weiman Wood Cleaner</li>
                          <li>• Method Wood Cleaner</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            <strong>Important:</strong> Never use water directly on wood. Always use a damp cloth, never a wet one, 
                            and dry immediately with a clean, dry cloth.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Polishing and Conditioning */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Polishing and Conditioning</h2>
                    
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Regular polishing helps maintain the wood's natural luster and provides a protective barrier 
                      against moisture and stains.
                    </p>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">How Often to Polish</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <strong>High-use furniture:</strong> Monthly (dining tables, desks)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          <strong>Medium-use furniture:</strong> Every 2-3 months (coffee tables, side tables)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <strong>Low-use furniture:</strong> Every 6 months (display cabinets, decorative pieces)
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Polishing Steps</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <p className="text-gray-700">
                            <strong>Clean first:</strong> Always clean the surface thoroughly before polishing to avoid 
                            trapping dirt under the polish.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <p className="text-gray-700">
                            <strong>Apply polish sparingly:</strong> Use a small amount of polish on a soft cloth. 
                            Too much polish can create a sticky residue.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <p className="text-gray-700">
                            <strong>Work with the grain:</strong> Apply polish in the direction of the wood grain 
                            for even coverage and better absorption.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                        <div>
                          <p className="text-gray-700">
                            <strong>Buff to shine:</strong> Use a clean, dry cloth to buff the surface until it 
                            achieves the desired shine.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Common Problems and Solutions */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Problems and Solutions</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Water Rings</h3>
                        <p className="text-gray-700 mb-3">
                          White rings left by hot or cold beverages can be frustrating, but they're often fixable.
                        </p>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-700">
                            <strong>Solution:</strong> Mix equal parts white vinegar and olive oil. Apply to the ring 
                            with a soft cloth, working in circular motions. Let sit for 15 minutes, then wipe clean.
                          </p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Scratches</h3>
                        <p className="text-gray-700 mb-3">
                          Light scratches can often be minimized with the right approach.
                        </p>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-700">
                            <strong>Solution:</strong> For light scratches, try rubbing a walnut or pecan over the scratch. 
                            The natural oils can help blend the scratch. For deeper scratches, consider using a wood 
                            stain marker that matches your furniture.
                          </p>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sticky Surfaces</h3>
                        <p className="text-gray-700 mb-3">
                          Over-polishing or using the wrong products can create sticky residue.
                        </p>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-700">
                            <strong>Solution:</strong> Clean with a solution of 1 tablespoon white vinegar in 1 cup 
                            warm water. Wipe with a damp cloth, then immediately dry with a clean cloth.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Seasonal Maintenance */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Seasonal Maintenance</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-orange-900 mb-2">Spring Cleaning</h3>
                        <ul className="text-orange-800 text-sm space-y-1">
                          <li>• Deep clean all surfaces</li>
                          <li>• Check for loose joints or hardware</li>
                          <li>• Apply fresh polish or wax</li>
                          <li>• Inspect for signs of wood-boring insects</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Winter Preparation</h3>
                        <ul className="text-blue-800 text-sm space-y-1">
                          <li>• Apply extra conditioning for dry air</li>
                          <li>• Use humidifiers to prevent cracking</li>
                          <li>• Keep furniture away from heat sources</li>
                          <li>• Check for moisture damage</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Conclusion */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Proper care of wooden furniture doesn't have to be complicated. With regular dusting, 
                      gentle cleaning, and appropriate polishing, your wooden pieces can maintain their beauty 
                      and functionality for many years to come.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Remember that prevention is always better than repair. By establishing a regular 
                      maintenance routine and addressing problems early, you'll save time and money while 
                      preserving your furniture's value and appearance.
                    </p>
                  </section>
                </div>
              ) : (
                <div className="text-gray-700 leading-relaxed">
                  <p>{tip.content}</p>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related Tips */}
        {relatedTips.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedTips.map((relatedTip) => (
                <Link
                  key={relatedTip.id}
                  href={`/tips/${relatedTip.slug}`}
                  className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-32 bg-gray-200 overflow-hidden">
                    <img
                      src={relatedTip.image}
                      alt={relatedTip.title}
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
                      <span>{formatDate(relatedTip.createdAt)}</span>
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
