'use client';

import { useState } from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { TipsTable } from '@/components/admin/TipsTable';
import { TipForm } from '@/components/admin/TipForm';

interface Tip {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  image: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  readTime: number;
  seoTitle?: string;
  seoDescription?: string;
}

export default function AdminTipsPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateTip = () => {
    setSelectedTip(null);
    setView('create');
  };

  const handleEditTip = (tip: Tip) => {
    setSelectedTip(tip);
    setView('edit');
  };

  const handleDeleteTip = async (tipId: string) => {
    if (!confirm('Are you sure you want to delete this tip?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/tips/${tipId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the tips list
        window.location.reload();
      } else {
        alert('Failed to delete tip: ' + (data.error || data.message));
      }
    } catch (error) {
      console.error('Error deleting tip:', error);
      alert('Failed to delete tip');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (tipId: string, published: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/tips/${tipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the tips list
        window.location.reload();
      } else {
        alert('Failed to update publish status: ' + (data.error || data.message));
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update publish status');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTip = async (tipData: Partial<Tip>) => {
    try {
      setLoading(true);
      const url = tipData._id 
        ? `/api/admin/tips/${tipData._id}` 
        : '/api/admin/tips';
      const method = tipData._id ? 'PUT' : 'POST';

      console.log('Saving tip data:', tipData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setView('list');
        // Refresh the tips list
        window.location.reload();
      } else {
        alert('Failed to save tip: ' + (data.message || data.error));
      }
    } catch (error) {
      console.error('Error saving tip:', error);
      alert('Failed to save tip: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setView('list');
    setSelectedTip(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'create':
      case 'edit':
        return (
          <div className="p-6">
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Tips
              </button>
            </div>
            <TipForm
              tip={selectedTip}
              onSave={handleSaveTip}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        );
      case 'list':
      default:
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Tips</h2>
              <button
                onClick={handleCreateTip}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Tip
              </button>
            </div>
            <TipsTable
              onEdit={handleEditTip}
              onDelete={handleDeleteTip}
              onTogglePublish={handleTogglePublish}
            />
          </div>
        );
    }
  };

  return (
    <AdminPageLayout
      title="Tips Management"
      description="Manage your furniture tips and guides"
      content={renderContent()}
    >
      <></>
    </AdminPageLayout>
  );
}

