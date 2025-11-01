'use client';

import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { OrdersTable } from '@/components/admin/OrdersTable';

export default function AdminOrdersPage() {
  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <AdminPageLayout
      title="Orders Management"
      description="View and manage customer orders"
      content={
        <div className="p-6">
          <OrdersTable onStatusUpdate={handleStatusUpdate} />
        </div>
      }
    >
      <></>
    </AdminPageLayout>
  );
}
