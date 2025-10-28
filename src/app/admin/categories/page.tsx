'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/admin/login');
      return;
    }

    if (session.user?.role !== 'admin') {
      router.push('/admin/login?error=AccessDenied');
      return;
    }
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <PageErrorBoundary>
      <AdminLayout onSignOut={handleSignOut}>
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage product categories
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Categories</h2>
            <p className="text-gray-600">Category management interface coming soon...</p>
          </div>
        </div>
      </AdminLayout>
    </PageErrorBoundary>
  );
}
