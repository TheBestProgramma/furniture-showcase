'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

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

  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Leather Sofa',
      price: 'KES 45,000',
      image: '🛋️',
      description: 'Luxurious 3-seater leather sofa with premium comfort'
    },
    {
      id: 2,
      name: 'Modern Dining Set',
      price: 'KES 35,000',
      image: '🪑',
      description: '6-seater dining table with matching chairs'
    },
    {
      id: 3,
      name: 'King Size Bed Frame',
      price: 'KES 25,000',
      image: '🛏️',
      description: 'Solid wood king size bed with storage drawers'
    },
    {
      id: 4,
      name: 'Coffee Table Set',
      price: 'KES 15,000',
      image: '☕',
      description: 'Glass top coffee table with matching side tables'
    }
  ]

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
    }, 5000)
    return () => clearInterval(timer)
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

          {/* Carousel Container */}
          <div className="relative px-8 md:px-16">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredProducts.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mx-4 md:mx-8 border-4 border-primary-100 hover:border-primary-300 transition-all duration-300">
                      <div className="md:flex">
                        <div className="md:w-1/2 bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 p-8 md:p-16 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                          <div className="text-8xl md:text-9xl relative z-10 drop-shadow-lg">{product.image}</div>
                        </div>
                        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-white to-primary-50">
                          <h3 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">{product.name}</h3>
                          <p className="text-lg md:text-xl text-secondary-600 mb-8 leading-relaxed">{product.description}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                            <span className="text-4xl md:text-5xl font-bold text-primary-600 drop-shadow-sm">{product.price}</span>
                            <button className="bg-white text-black px-8 md:px-10 py-4 rounded-2xl hover:bg-primary-50 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl w-full sm:w-auto transform hover:scale-105 border-2 border-primary-600">
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)}
              className="absolute -left-4 md:-left-8 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary-50 text-primary-600 p-4 md:p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-20 border-4 border-primary-200 hover:border-primary-400"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)}
              className="absolute -right-4 md:-right-8 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary-50 text-primary-600 p-4 md:p-5 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-20 border-4 border-primary-200 hover:border-primary-400"
            >
              <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-12 space-x-4">
            {featuredProducts.map((_, index) => (
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
        </div>
      </section>

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