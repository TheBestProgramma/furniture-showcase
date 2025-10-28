'use client';

import { useState, useEffect } from 'react';
import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductForm } from '@/components/admin/ProductForm';

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: {
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
    weight?: number;
  };
  material: string[];
  color: string;
  brand?: string;
  productModel?: string;
  sku: string;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  onSale: boolean;
  discountPercentage?: number;
  tags: string[];
  specifications: {
    [key: string]: string | number;
  };
}

export default function AdminProductsPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setView('create');
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('edit');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        // Refresh the products list
        window.location.reload();
      } else {
        alert('Failed to delete product: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      setLoading(true);
      const url = productData._id ? `/api/products/${productData._id}` : '/api/products';
      const method = productData._id ? 'PUT' : 'POST';

      console.log('Saving product data:', productData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setView('list');
        // Refresh the products list
        window.location.reload();
      } else {
        alert('Failed to save product: ' + (data.message || data.error));
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setView('list');
    setSelectedProduct(null);
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
                ← Back to Products
              </button>
            </div>
            <ProductForm
              product={selectedProduct}
              onSave={handleSaveProduct}
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
              <h2 className="text-xl font-semibold text-gray-900">Products</h2>
              <button
                onClick={handleCreateProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add Product
              </button>
            </div>
            <ProductsTable
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        );
    }
  };

  return (
    <AdminPageLayout
      title="Products Management"
      description="Manage your furniture products"
      content={renderContent()}
    >
      <></>
    </AdminPageLayout>
  );
}
