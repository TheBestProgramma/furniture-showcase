'use client';

import { useState, useEffect } from 'react';

interface Settings {
  siteName?: string;
  siteDescription?: string;
  whatsappPhone?: string;
  returnPolicy?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
}

interface SettingsFormProps {
  settings?: Settings | null;
  onSave: (settingsData: Partial<Settings>) => Promise<void>;
  loading?: boolean;
}

export function SettingsForm({ settings, onSave, loading = false }: SettingsFormProps) {
  const [formData, setFormData] = useState<Partial<Settings>>({
    siteName: '',
    siteDescription: '',
    whatsappPhone: '',
    returnPolicy: '',
    contactInfo: {
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || '',
        siteDescription: settings.siteDescription || '',
        whatsappPhone: settings.whatsappPhone || settings.contactInfo?.phone || '',
        returnPolicy: settings.returnPolicy || '',
        contactInfo: {
          email: settings.contactInfo?.email || '',
          phone: settings.contactInfo?.phone || settings.whatsappPhone || '',
          address: {
            street: settings.contactInfo?.address?.street || '',
            city: settings.contactInfo?.address?.city || '',
            state: settings.contactInfo?.address?.state || '',
            zipCode: settings.contactInfo?.address?.zipCode || '',
            country: settings.contactInfo?.address?.country || ''
          }
        }
      });
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested contactInfo fields
    if (name.startsWith('contactInfo.')) {
      const parts = name.split('.');
      
      if (parts.length === 2) {
        // contactInfo.email or contactInfo.phone
        const field = parts[1];
        setFormData(prev => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            [field]: value
          } as any
        }));
      } else if (parts.length === 3 && parts[1] === 'address') {
        // contactInfo.address.street, contactInfo.address.city, etc.
        const addressField = parts[2];
        setFormData(prev => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            address: {
              ...prev.contactInfo?.address,
              [addressField]: value
            }
          } as any
        }));
      }
    } else {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.siteName?.trim()) {
      newErrors.siteName = 'Business name is required';
    }

    if (!formData.siteDescription?.trim()) {
      newErrors.siteDescription = 'Business description is required';
    }

    if (!formData.whatsappPhone?.trim()) {
      newErrors.whatsappPhone = 'Seller phone number is required for WhatsApp orders';
    } else {
      // Validate phone format (Kenyan format)
      const phoneRegex = /^(\+254|0)[0-9]{9}$/;
      const cleaned = formData.whatsappPhone.replace(/\D/g, '');
      if (!phoneRegex.test(formData.whatsappPhone) && cleaned.length < 9) {
        newErrors.whatsappPhone = 'Please enter a valid Kenyan phone number (e.g., +254712345678 or 0712345678)';
      }
    }

    if (!formData.returnPolicy?.trim()) {
      newErrors.returnPolicy = 'Return policy text is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Sync whatsappPhone with contactInfo.phone
      const dataToSave = {
        ...formData,
        contactInfo: {
          ...formData.contactInfo,
          phone: formData.whatsappPhone || formData.contactInfo?.phone
        }
      };
      await onSave(dataToSave);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Business Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName || ''}
              onChange={handleInputChange}
              maxLength={100}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.siteName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter business name"
            />
            {errors.siteName && <p className="text-red-500 text-sm mt-1">{errors.siteName}</p>}
            <p className="text-xs text-gray-500 mt-1">{formData.siteName?.length || 0}/100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Description *
            </label>
            <textarea
              name="siteDescription"
              value={formData.siteDescription || ''}
              onChange={handleInputChange}
              rows={4}
              maxLength={500}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.siteDescription ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter business description"
            />
            {errors.siteDescription && <p className="text-red-500 text-sm mt-1">{errors.siteDescription}</p>}
            <p className="text-xs text-gray-500 mt-1">{formData.siteDescription?.length || 0}/500 characters</p>
          </div>
        </div>
      </div>

      {/* Contact & WhatsApp */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="contactInfo.email"
              value={formData.contactInfo?.email || ''}
              onChange={handleInputChange}
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="info@yourbusiness.com"
            />
            <p className="text-xs text-gray-500 mt-1">This email will be displayed in the footer and used for customer inquiries.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (WhatsApp) *
            </label>
            <input
              type="tel"
              name="whatsappPhone"
              value={formData.whatsappPhone || ''}
              onChange={handleInputChange}
              maxLength={20}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.whatsappPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+254712345678 or 0712345678"
            />
            {errors.whatsappPhone && <p className="text-red-500 text-sm mt-1">{errors.whatsappPhone}</p>}
            <p className="text-xs text-gray-500 mt-1">
              This phone number will be used for WhatsApp order notifications and displayed in the footer. Format: +254712345678 or 0712345678
            </p>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Business Address</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="contactInfo.address.street"
                  value={formData.contactInfo?.address?.street || ''}
                  onChange={handleInputChange}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="contactInfo.address.city"
                    value={formData.contactInfo?.address?.city || ''}
                    onChange={handleInputChange}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nairobi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="contactInfo.address.state"
                    value={formData.contactInfo?.address?.state || ''}
                    onChange={handleInputChange}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nairobi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    name="contactInfo.address.zipCode"
                    value={formData.contactInfo?.address?.zipCode || ''}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="00100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="contactInfo.address.country"
                    value={formData.contactInfo?.address?.country || ''}
                    onChange={handleInputChange}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Kenya"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This address will be displayed in the footer.</p>
          </div>
        </div>
      </div>

      {/* Return Policy */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Return Policy</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Policy Text *
          </label>
          <textarea
            name="returnPolicy"
            value={formData.returnPolicy || ''}
            onChange={handleInputChange}
            rows={8}
            maxLength={2000}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.returnPolicy ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your return policy details..."
          />
          {errors.returnPolicy && <p className="text-red-500 text-sm mt-1">{errors.returnPolicy}</p>}
          <p className="text-xs text-gray-500 mt-1">{formData.returnPolicy?.length || 0}/2000 characters</p>
          <p className="text-xs text-gray-500 mt-1">
            This policy will be displayed to customers on product pages and checkout.
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}




