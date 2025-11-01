'use client';

import Image from 'next/image';
import { CartItem } from '@/store/cartStore';

interface OrderSummaryProps {
  items: CartItem[];
}

export function OrderSummary({ items }: OrderSummaryProps) {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 100000 ? 0 : 15000; // Free shipping over KSh 100,000
  const tax = Math.round(subtotal * 0.16); // 16% VAT
  const total = subtotal + shipping + tax;

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString('en-KE')}`;
  };

  return (
    <div className="space-y-6">
      {/* Items List */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Items in your order</h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id || `cart-item-${index}`} className="flex items-center space-x-4">
              <div className="shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.category}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatPrice(subtotal)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-900">
              {shipping === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>

          {/* Tax */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (VAT 16%)</span>
            <span className="text-gray-900">{formatPrice(tax)}</span>
          </div>

          {/* Free shipping notice */}
          {subtotal < 100000 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    Add {formatPrice(100000 - subtotal)} more for free shipping!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-base font-medium">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="mpesa"
              name="payment"
              type="radio"
              value="mpesa"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              defaultChecked
            />
            <label htmlFor="mpesa" className="ml-3 text-sm font-medium text-gray-700">
              M-Pesa
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="card"
              name="payment"
              type="radio"
              value="card"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="card" className="ml-3 text-sm font-medium text-gray-700">
              Credit/Debit Card
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="bank"
              name="payment"
              type="radio"
              value="bank"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="bank" className="ml-3 text-sm font-medium text-gray-700">
              Bank Transfer
            </label>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">Secure Checkout</h4>
            <p className="mt-1 text-sm text-gray-600">
              Your payment information is encrypted and secure. We never store your payment details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
