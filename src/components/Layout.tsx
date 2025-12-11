'use client'

import { useState } from 'react'
import Link from 'next/link'
import Footer from './Footer'
import CartIcon from './CartIcon'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <nav className="bg-primary-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-bold text-lg">F</span>
              </div>
              <h1 className="font-bold text-xl">FurniturePro</h1>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex gap-6">
              <li>
                <Link href="/" className="hover:text-primary-200 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary-200 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary-200 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/tips" className="hover:text-primary-200 transition-colors">
                  Tips
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-200 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Right side - Cart Icon and Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {/* Cart Icon */}
              <CartIcon />
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-primary-600">
              <ul className="flex flex-col gap-4 pt-4">
                <li>
                  <Link 
                    href="/" 
                    className="block py-2 hover:text-primary-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/categories" 
                    className="block py-2 hover:text-primary-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/products" 
                    className="block py-2 hover:text-primary-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/tips" 
                    className="block py-2 hover:text-primary-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tips
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="block py-2 hover:text-primary-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Layout;
