'use client';

import { AdminPageLayout } from '@/components/admin/AdminPageLayout';
import { CustomersTable } from '@/components/admin/CustomersTable';

export default function AdminCustomersPage() {
  return (
    <AdminPageLayout
      title="Customers Management"
      description="View and manage customer information and order history"
      content={
        <div className="p-6">
          <CustomersTable />
        </div>
      }
    >
      <></>
    </AdminPageLayout>
  );
}

