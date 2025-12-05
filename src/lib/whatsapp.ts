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

export class WhatsAppIntegration {
  // Fallback values if settings are not available
  private static readonly DEFAULT_SELLER_PHONE = '+254797529105';
  private static readonly DEFAULT_BUSINESS_NAME = 'Furniture Showcase';

  /**
   * Get seller phone from settings (client-side)
   * This should be called with settings fetched from API
   */
  static getSellerPhone(settings?: { whatsappPhone?: string }): string {
    return settings?.whatsappPhone || this.DEFAULT_SELLER_PHONE;
  }

  /**
   * Get business name from settings (client-side)
   */
  static getBusinessName(settings?: { siteName?: string }): string {
    return settings?.siteName || this.DEFAULT_BUSINESS_NAME;
  }

  /**
   * Generate WhatsApp message with order details
   */
  static generateOrderMessage(
    customerInfo: CustomerInfo,
    orderSummary: OrderSummary,
    orderNumber?: string,
    businessName?: string
  ): string {
    const business = businessName || this.DEFAULT_BUSINESS_NAME;
    const { items, subtotal, shipping, tax, total } = orderSummary;
    
    // Format currency
    const formatPrice = (price: number) => `KSh ${price.toLocaleString('en-KE')}`;
    
    // Generate order header
    const orderHeader = orderNumber 
      ? `🛒 *NEW ORDER - ${orderNumber}*`
      : '🛒 *NEW ORDER*';
    
    // Customer information
    const customerSection = `
👤 *CUSTOMER DETAILS*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Email: ${customerInfo.email}

📍 *DELIVERY ADDRESS*
${customerInfo.deliveryAddress.street}
${customerInfo.deliveryAddress.city}, ${customerInfo.deliveryAddress.state}
${customerInfo.deliveryAddress.zipCode}, ${customerInfo.deliveryAddress.country}`;

    // Order items
    const itemsSection = `
🛋️ *ORDER ITEMS*
${items.map((item, index) => 
  `${index + 1}. ${item.name}
   Category: ${item.category}
   Color: ${item.color}
   Quantity: ${item.quantity}
   Price: ${formatPrice(item.price)} each
   Total: ${formatPrice(item.price * item.quantity)}`
).join('\n\n')}`;

    // Order summary
    const summarySection = `
💰 *ORDER SUMMARY*
Subtotal: ${formatPrice(subtotal)}
Shipping: ${shipping === 0 ? 'FREE' : formatPrice(shipping)}
Tax (16%): ${formatPrice(tax)}
━━━━━━━━━━━━━━━━━━━━
*TOTAL: ${formatPrice(total)}*`;

    // Additional notes
    const notesSection = customerInfo.notes 
      ? `\n📝 *DELIVERY NOTES*\n${customerInfo.notes}`
      : '';

    // Footer
    const footer = `
━━━━━━━━━━━━━━━━━━━━
Order placed via ${business} website
Time: ${new Date().toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}

Please confirm this order and provide delivery timeline.`;

    return `${orderHeader}${customerSection}${itemsSection}${summarySection}${notesSection}${footer}`;
  }

  /**
   * Generate WhatsApp Web URL for sending message
   */
  static generateWhatsAppUrl(message: string, sellerPhone?: string): string {
    const phone = sellerPhone || this.DEFAULT_SELLER_PHONE;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone.replace('+', '')}?text=${encodedMessage}`;
  }

  /**
   * Generate WhatsApp Web URL for sending message (alternative method)
   */
  static generateWhatsAppWebUrl(message: string, sellerPhone?: string): string {
    const phone = sellerPhone || this.DEFAULT_SELLER_PHONE;
    const encodedMessage = encodeURIComponent(message);
    return `https://web.whatsapp.com/send?phone=${phone.replace('+', '')}&text=${encodedMessage}`;
  }

  /**
   * Check if device supports WhatsApp
   */
  static isWhatsAppSupported(): boolean {
    if (typeof window === 'undefined') return false;
    
    const userAgent = window.navigator.userAgent;
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }

  /**
   * Open WhatsApp with order message
   */
  static openWhatsApp(message: string, sellerPhone?: string): void {
    if (typeof window === 'undefined') return;

    const url = this.isWhatsAppSupported() 
      ? this.generateWhatsAppUrl(message, sellerPhone)
      : this.generateWhatsAppWebUrl(message, sellerPhone);
    
    window.open(url, '_blank');
  }

  /**
   * Generate order confirmation message for customer
   */
  static async generateCustomerConfirmation(
    orderNumber: string,
    customerInfo: CustomerInfo,
    orderSummary: OrderSummary
  ): Promise<string> {
    const { total } = orderSummary;
    const formatPrice = (price: number) => `KSh ${price.toLocaleString('en-KE')}`;
    const businessName = await this.getBusinessName();
    
    return `✅ *ORDER CONFIRMED - ${orderNumber}*

Hi ${customerInfo.name},

Thank you for your order! We've received your order and will process it shortly.

📋 *Order Summary*
Total Amount: ${formatPrice(total)}
Delivery Address: ${customerInfo.deliveryAddress.street}, ${customerInfo.deliveryAddress.city}

📞 *Next Steps*
1. We'll contact you within 24 hours to confirm details
2. Your order will be prepared within 1-2 business days
3. You'll receive tracking information once shipped

Questions? Reply to this message or call us directly.

Thank you for choosing ${businessName}! 🛋️`;
  }

  /**
   * Generate order status update message
   */
  static generateStatusUpdate(
    orderNumber: string,
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled',
    trackingNumber?: string
  ): string {
    const statusEmojis = {
      processing: '🔄',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };

    const statusMessages = {
      processing: 'Your order is being prepared',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled'
    };

    let message = `${statusEmojis[status]} *ORDER UPDATE - ${orderNumber}*\n\n`;
    message += `${statusMessages[status]}.`;
    
    if (trackingNumber) {
      message += `\n\n📦 Tracking Number: ${trackingNumber}`;
    }
    
    message += `\n\nThank you for your patience!`;
    
    return message;
  }
}

/**
 * Utility functions for WhatsApp integration
 */
export const whatsappUtils = {
  /**
   * Format phone number for WhatsApp
   */
  formatPhoneNumber: (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if missing
    if (cleaned.startsWith('254')) {
      return `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      return `+254${cleaned.substring(1)}`;
    } else if (cleaned.length === 9) {
      return `+254${cleaned}`;
    }
    
    return `+${cleaned}`;
  },

  /**
   * Validate phone number format
   */
  isValidPhoneNumber: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return /^(254|0)?[0-9]{9}$/.test(cleaned);
  },

  /**
   * Generate quick order message (simplified)
   */
  generateQuickOrderMessage: (items: CartItem[], total: number): string => {
    const formatPrice = (price: number) => `KSh ${price.toLocaleString('en-KE')}`;
    
    const itemsList = items.map(item => 
      `• ${item.name} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}`
    ).join('\n');
    
    return `🛒 *Quick Order Inquiry*

${itemsList}

Total: ${formatPrice(total)}

Please provide your details for delivery.`;
  }
};






