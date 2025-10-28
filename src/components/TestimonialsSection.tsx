'use client';

import { useState, useEffect } from 'react';
import { getFeaturedTestimonials, mockTestimonials, testimonialCategories } from '@/lib/types/testimonials';
import TestimonialCard from './TestimonialCard';

interface TestimonialsSectionProps {
  variant?: 'homepage' | 'full' | 'compact';
  showAll?: boolean;
  maxItems?: number;
}

export default function TestimonialsSection({ 
  variant = 'homepage', 
  showAll = false, 
  maxItems = 6 
}: TestimonialsSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredTestimonials, setFilteredTestimonials] = useState(mockTestimonials);

  // Filter testimonials based on category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredTestimonials(mockTestimonials);
    } else {
      const category = testimonialCategories.find(cat => cat.slug === selectedCategory);
      if (category) {
        setFilteredTestimonials(
          mockTestimonials.filter(testimonial => 
            testimonial.product?.toLowerCase().includes(category.slug.toLowerCase())
          )
        );
      }
    }
  }, [selectedCategory]);

  const featuredTestimonials = getFeaturedTestimonials();
  const displayTestimonials = showAll ? filteredTestimonials : featuredTestimonials;
  const limitedTestimonials = displayTestimonials.slice(0, maxItems);

  // Auto-rotate carousel for homepage variant
  useEffect(() => {
    if (variant === 'homepage' && limitedTestimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % limitedTestimonials.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [variant, limitedTestimonials.length]);

  if (variant === 'compact') {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What Our Customers Say
            </h2>
            <div className="w-16 h-1 bg-primary-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {limitedTestimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard 
                key={testimonial.id} 
                testimonial={testimonial} 
                variant="compact" 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'homepage') {
    return (
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
              What Our Customers Say
            </h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative px-8 md:px-16">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {limitedTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <div className="px-4 md:px-8">
                      <TestimonialCard 
                        testimonial={testimonial} 
                        variant="featured" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            {limitedTestimonials.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + limitedTestimonials.length) % limitedTestimonials.length)}
                  className="absolute -left-4 md:-left-8 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary-50 text-primary-600 p-4 md:p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-20 border-4 border-primary-200 hover:border-primary-400"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % limitedTestimonials.length)}
                  className="absolute -right-4 md:-right-8 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary-50 text-primary-600 p-4 md:p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-20 border-4 border-primary-200 hover:border-primary-400"
                >
                  <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Carousel Indicators */}
          {limitedTestimonials.length > 1 && (
            <div className="flex justify-center mt-12 space-x-4">
              {limitedTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary-600 w-12 h-4 shadow-xl' 
                      : 'bg-gray-300 w-4 h-4 hover:bg-primary-400 hover:scale-125'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-primary-600 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full variant with filtering
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Customer Testimonials
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Read what our customers have to say about their furniture shopping experience
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
            }`}
          >
            All Reviews
          </button>
          {testimonialCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.slug
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-primary-50 border border-gray-200'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              variant="default" 
            />
          ))}
        </div>

        {/* Load More Button */}
        {filteredTestimonials.length > maxItems && (
          <div className="text-center mt-12">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-xl hover:bg-primary-700 transition-colors font-semibold">
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}







