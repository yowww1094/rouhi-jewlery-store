import { Suspense } from 'react';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { revalidatePath } from 'next/cache';
import OrdersTableClient from '@/components/admin/OrdersTableClient';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  await connectToDatabase();
  
  const params = await searchParams;
  const page = parseInt(params.page as string) || 1;
  const ITEMS_PER_PAGE = 10;
  
  const search = (params.search as string) || '';
  const statusFilter = (params.status as string) || 'All';

  const query: any = {};
  if (statusFilter !== 'All') {
    query.status = statusFilter;
  }
  
  if (search) {
    query.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customer.fullName': { $regex: search, $options: 'i' } },
      { 'customer.phone': { $regex: search, $options: 'i' } }
    ];
  }
  
  const totalOrders = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .lean();

  async function updateOrderStatus(orderId: string, formData: FormData) {
    'use server';
    const status = formData.get('status') as string;
    await connectToDatabase();
    await Order.findByIdAndUpdate(orderId, { status });
    revalidatePath('/admin/orders');
    // If we have Google Sheets integration, we might trigger a sync here
  }

  // Sanitize objects to plain JSON so they can be passed to Client Component
  const plainOrders = JSON.parse(JSON.stringify(orders));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer orders and update their status.</p>
        </div>
      </div>

      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersTableClient 
          orders={plainOrders} 
          currentPage={page} 
          totalPages={totalPages} 
          totalOrders={totalOrders}
        />
      </Suspense>
    </div>
  );
}
