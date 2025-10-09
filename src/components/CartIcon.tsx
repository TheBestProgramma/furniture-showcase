'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

export default function CartIcon() {
  const router = useRouter();
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <button
      onClick={() => router.push('/cart')}
      className="relative p-2 text-black hover:text-gray-700 transition-colors duration-200 bg-white hover:bg-gray-100 rounded-md border border-gray-300 shadow-sm"
      style={{ minWidth: '40px', minHeight: '40px', zIndex: 10 }}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
