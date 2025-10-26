'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import TestimonialsSection from '@/components/TestimonialsSection'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard'
import ProductGridSkeleton from '@/components/ProductGridSkeleton'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const categories = [
    { name: 'Beds', icon: '🛏️', href: '/products?category=beds', description: 'Comfortable beds for every bedroom' },
    { name: 'Sofas', icon: '🛋️', href: '/products?category=sofas', description: 'Stylish sofas for your living room' },
    { name: 'Dining Tables', icon: '🪑', href: '/products?category=dining', description: 'Elegant dining sets for family meals' },
    { name: 'Coffee Tables', icon: '☕', href: '/products?category=coffee', description: 'Perfect centerpieces for your living space' },
    { name: 'Cabinets', icon: '🗄️', href: '/products?category=cabinets', description: 'Storage solutions for every room' },
    { name: 'Wardrobe Doors', icon: '🚪', href: '/products?category=wardrobe', description: 'Custom wardrobe doors and systems' },
  ]

  // Fetch featured products from API
  const { products: featuredProducts, loading: featuredLoading, error: featuredError } = useProducts({
    featured: true,
    limit: 4,
    sortBy: 'featured',
    sortOrder: 'desc'
  })

  // Auto-rotate carousel
  useEffect(() => {
    if (featuredProducts.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredProducts.length])

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-primary-700 mb-6 leading-tight">
              Welcome to <span className="text-primary-600">FurniturePro</span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your home with our premium collection of furniture. Quality craftsmanship meets modern design.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/products" 
              className="bg-white text-primary-600 px-10 py-4 rounded-xl hover:bg-primary-50 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-primary-600"
            >
              Shop Now
            </Link>
            <Link 
              href="/tips" 
              className="bg-white text-primary-600 px-10 py-4 rounded-xl hover:bg-primary-50 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-primary-600"
            >
              Care Tips
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
              Browse by Category
            </h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Find the perfect furniture for every room in your home
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href}>
                <div className="group bg-white p-8 rounded-2xl text-center hover:bg-primary-50 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 transform hover:-translate-y-2">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                  <h3 className="font-bold text-lg text-secondary-900 mb-2">{cat.name}</h3>
                  <p className="text-sm text-secondary-600 group-hover:text-primary-600 transition-colors">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
              Featured Products
            </h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Discover our most popular furniture pieces
            </p>
          </div>

          {/* Loading State */}
          {featuredLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProductGridSkeleton count={4} columns={1} />
            </div>
          )}

          {/* Error State */}
          {featuredError && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading featured products</h3>
              <p className="mt-1 text-sm text-gray-500">{featuredError}</p>
            </div>
          )}

          {/* Featured Products Grid */}
          {!featuredLoading && !featuredError && featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* No Featured Products */}
          {!featuredLoading && !featuredError && featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No featured products available
              </h3>
              <p className="text-gray-600 mb-6">
                Check back soon for our featured furniture collection.
              </p>
              <Link
                href="/products"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection variant="homepage" />

      {/* Enhanced Tips Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
              Furniture Care Tips
            </h2>
            <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Keep your furniture looking beautiful for years to come
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="font-bold text-xl mb-4 text-secondary-900">Wood Care</h3>
              <p className="text-secondary-600 leading-relaxed">
                Keep your wooden furniture looking new with regular dusting, occasional polishing, and avoiding direct sunlight exposure.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🧽</div>
              <h3 className="font-bold text-xl mb-4 text-secondary-900">Fabric Maintenance</h3>
              <p className="text-secondary-600 leading-relaxed">
                Vacuum upholstered furniture regularly, treat stains immediately, and rotate cushions to ensure even wear.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="font-bold text-xl mb-4 text-secondary-900">Storage Tips</h3>
              <p className="text-secondary-600 leading-relaxed">
                Store furniture in dry, well-ventilated areas and use protective covers when not in use to prevent damage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
            Ready to Transform Your Home?
          </h2>
          <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Browse our complete collection and find the perfect furniture pieces for your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="bg-white text-primary-600 px-10 py-4 rounded-xl hover:bg-primary-50 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Products
            </Link>
            <Link 
              href="/contact" 
              className="bg-white text-primary-600 px-10 py-4 rounded-xl hover:bg-primary-50 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-white"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}