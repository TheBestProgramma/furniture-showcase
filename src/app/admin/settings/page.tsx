'use client';

import { useState, useEffect } from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { SettingsForm } from '@/components/admin/SettingsForm';

interface Settings {
  _id?: string;
  siteName?: string;
  siteDescription?: string;
  whatsappPhone?: string;
  returnPolicy?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.data?.settings || null);
      } else {
        setError(data.error || 'Failed to fetch settings');
      }
    } catch (err) {
      setError('Failed to fetch settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (settingsData: Partial<Settings>) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setSettings(data.data?.settings || settingsData);
        alert('Settings saved successfully!');
        // Optionally refresh to get updated settings
        await fetchSettings();
      } else {
        setError(data.error || data.message || 'Failed to save settings');
        throw new Error(data.error || data.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminPageLayout
        title="Settings"
        description="Manage your store settings"
        content={
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading settings...</p>
              </div>
            </div>
          </div>
        }
      >
        <></>
      </AdminPageLayout>
    );
  }

  if (error && !settings) {
    return (
      <AdminPageLayout
        title="Settings"
        description="Manage your store settings"
        content={
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={fetchSettings}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        }
      >
        <></>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title="Settings"
      description="Manage your store settings and preferences"
      content={
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
          <SettingsForm
            settings={settings}
            onSave={handleSave}
            loading={saving}
          />
        </div>
      }
    >
      <></>
    </AdminPageLayout>
  );
}

