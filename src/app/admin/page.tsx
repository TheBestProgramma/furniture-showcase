'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardWidgets } from '@/components/admin/DashboardWidgets';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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

    setIsLoading(false);
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PageErrorBoundary>
      <AdminLayout onSignOut={handleSignOut}>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {session?.user?.name || session?.user?.email}
            </p>
          </div>

          {/* Dashboard Widgets */}
          <DashboardWidgets />
        </div>
      </AdminLayout>
    </PageErrorBoundary>
  );
}
