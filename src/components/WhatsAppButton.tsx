'use client';

import { useState } from 'react';
import { WhatsAppIntegration, whatsappUtils } from '@/lib/whatsapp';
import { CartItem } from '@/store/cartStore';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface WhatsAppButtonProps {
  customerInfo: CustomerInfo;
  orderSummary: OrderSummary;
  orderNumber?: string;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function WhatsAppButton({
  customerInfo,
  orderSummary,
  orderNumber,
  variant = 'primary',
  size = 'md',
  showIcon = true,
  className = ''
}: WhatsAppButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleWhatsAppClick = async () => {
    setIsGenerating(true);
    
    try {
      // Generate the order message
      const message = WhatsAppIntegration.generateOrderMessage(
        customerInfo,
        orderSummary,
        orderNumber
      );
      
      // Open WhatsApp with the message
      WhatsAppIntegration.openWhatsApp(message);
    } catch (error) {
      console.error('Error generating WhatsApp message:', error);
      // Fallback: open WhatsApp without pre-filled message
      const fallbackMessage = `Hi! I'd like to place an order for furniture. Order #${orderNumber || 'NEW'}`;
      WhatsAppIntegration.openWhatsApp(fallbackMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
      case 'secondary':
        return 'bg-white hover:bg-gray-50 text-green-600 border-green-600';
      case 'success':
        return 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-5 h-5';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      disabled={isGenerating}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-md border transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${className}
      `}
    >
      {isGenerating ? (
        <>
          <svg className={`animate-spin ${getIconSize()}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </>
      ) : (
        <>
          {showIcon && (
            <svg className={getIconSize()} fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          )}
          Send to Seller via WhatsApp
        </>
      )}
    </button>
  );
}

/**
 * Quick WhatsApp button for simple orders
 */
export function QuickWhatsAppButton({
  items,
  total,
  className = ''
}: {
  items: CartItem[];
  total: number;
  className?: string;
}) {
  const handleQuickWhatsApp = () => {
    const message = whatsappUtils.generateQuickOrderMessage(items, total);
    WhatsAppIntegration.openWhatsApp(message);
  };

  return (
    <button
      onClick={handleQuickWhatsApp}
      className={`
        inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md
        hover:bg-green-700 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${className}
      `}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
      </svg>
      Quick Order via WhatsApp
    </button>
  );
}






