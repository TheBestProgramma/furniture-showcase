'use client';

import { useState } from 'react';

interface CheckoutFormData {
  customerName: string;
  phoneNumber: string;
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

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isSubmitting: boolean;
}

interface FormErrors {
  customerName?: string;
  phoneNumber?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: '',
    phoneNumber: '',
    email: '',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Kenya', // Default to Kenya based on KSh currency usage
    },
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Customer name validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    } else if (formData.customerName.trim().length > 100) {
      newErrors.customerName = 'Name cannot exceed 100 characters';
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else {
      const phoneRegex = /^(\+254|0)[0-9]{9}$/;
      if (!phoneRegex.test(formData.phoneNumber.trim())) {
        newErrors.phoneNumber = 'Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)';
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Address validation
    if (!formData.deliveryAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    } else if (formData.deliveryAddress.street.trim().length < 5) {
      newErrors.street = 'Street address must be at least 5 characters';
    }

    if (!formData.deliveryAddress.city.trim()) {
      newErrors.city = 'City is required';
    } else if (formData.deliveryAddress.city.trim().length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    if (!formData.deliveryAddress.state.trim()) {
      newErrors.state = 'State/County is required';
    } else if (formData.deliveryAddress.state.trim().length < 2) {
      newErrors.state = 'State/County must be at least 2 characters';
    }

    if (!formData.deliveryAddress.zipCode.trim()) {
      newErrors.zipCode = 'Postal code is required';
    } else if (!/^\d{5}$/.test(formData.deliveryAddress.zipCode.trim())) {
      newErrors.zipCode = 'Postal code must be 5 digits';
    }

    if (!formData.deliveryAddress.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('deliveryAddress.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Name */}
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="customerName"
          value={formData.customerName}
          onChange={(e) => handleInputChange('customerName', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.customerName ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="+254712345678 or 0712345678"
          disabled={isSubmitting}
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Delivery Address */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h3>
        
        {/* Street Address */}
        <div className="mb-4">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            id="street"
            value={formData.deliveryAddress.street}
            onChange={(e) => handleInputChange('deliveryAddress.street', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.street ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="123 Main Street, Building Name"
            disabled={isSubmitting}
          />
          {errors.street && (
            <p className="mt-1 text-sm text-red-600">{errors.street}</p>
          )}
        </div>

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={formData.deliveryAddress.city}
              onChange={(e) => handleInputChange('deliveryAddress.city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.city ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nairobi"
              disabled={isSubmitting}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              County *
            </label>
            <input
              type="text"
              id="state"
              value={formData.deliveryAddress.state}
              onChange={(e) => handleInputChange('deliveryAddress.state', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.state ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Nairobi"
              disabled={isSubmitting}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>
        </div>

        {/* Zip Code and Country */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              id="zipCode"
              value={formData.deliveryAddress.zipCode}
              onChange={(e) => handleInputChange('deliveryAddress.zipCode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.zipCode ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="00100"
              disabled={isSubmitting}
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              id="country"
              value={formData.deliveryAddress.country}
              onChange={(e) => handleInputChange('deliveryAddress.country', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.country ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Other">Other</option>
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any special delivery instructions..."
          disabled={isSubmitting}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Order...
            </div>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </form>
  );
}






