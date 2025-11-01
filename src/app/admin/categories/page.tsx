'use client';

import { useState } from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { CategoriesTable } from '@/components/admin/CategoriesTable';
import { CategoryForm } from '@/components/admin/CategoryForm';

interface Category {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  parentCategory?: string;
  sortOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export default function AdminCategoriesPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setView('create');
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setView('edit');
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the categories list
        window.location.reload();
      } else {
        alert('Failed to delete category: ' + (data.error || data.message));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      setLoading(true);
      const url = categoryData._id 
        ? `/api/admin/categories/${categoryData._id}` 
        : '/api/admin/categories';
      const method = categoryData._id ? 'PUT' : 'POST';

      console.log('Saving category data:', categoryData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setView('list');
        // Refresh the categories list
        window.location.reload();
      } else {
        alert('Failed to save category: ' + (data.message || data.error));
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setView('list');
    setSelectedCategory(null);
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
                ← Back to Categories
              </button>
            </div>
            <CategoryForm
              category={selectedCategory}
              onSave={handleSaveCategory}
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
              <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
              <button
                onClick={handleCreateCategory}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Category
              </button>
            </div>
            <CategoriesTable
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          </div>
        );
    }
  };

  return (
    <AdminPageLayout
      title="Categories Management"
      description="Manage your product categories"
      content={renderContent()}
    >
      <></>
    </AdminPageLayout>
  );
}
