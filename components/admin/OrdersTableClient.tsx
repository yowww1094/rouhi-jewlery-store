'use client';

import { useState, useMemo, useRef } from 'react';
import { updateOrderStatus } from '@/actions/order';
import { Eye, X } from 'lucide-react';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function OrdersTableClient({ 
  orders, 
  currentPage, 
  totalPages,
  totalOrders 
}: { 
  orders: any[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
}) {
  const [selectedOrderForPreview, setSelectedOrderForPreview] = useState<any>(null);
  const ITEMS_PER_PAGE = 10;
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const currentStatusFilter = searchParams.get('status') || 'All';

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set('search', val);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    }, 400); // 400ms debounce
  };

  const handleFilterChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status && status !== 'All') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusUpdate = async (orderId: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateOrderStatus(orderId, formData);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 w-full flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search by order ID, name, or phone..." 
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full sm:max-w-md text-sm px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>
        <div className="w-full sm:w-auto">
          <select 
            value={currentStatusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-full sm:w-auto text-sm px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id.toString()}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{order.customer.fullName}</div>
                  <div className="text-xs text-gray-400">{order.customer.phone}</div>
                  <div className="text-xs text-gray-400">{order.customer.city}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {order.totalAmount.toFixed(2)} MAD
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'Confirmed' ? 'bg-indigo-100 text-indigo-800' : ''}
                    ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-4">
                    <button 
                      onClick={() => setSelectedOrderForPreview(order)}
                      className="text-zinc-600 hover:text-zinc-900 transition-colors"
                      title="Quick View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <form onSubmit={(e) => handleStatusUpdate(order._id.toString(), e)} className="flex items-center justify-end gap-2">
                      <select 
                        name="status"
                        defaultValue={order.status}
                        className="text-xs font-medium border border-gray-200 bg-gray-50 text-gray-700 rounded-md px-3 py-1.5 focus:border-black focus:ring-1 focus:ring-black outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button type="submit" className="text-xs font-semibold text-white bg-black hover:bg-zinc-800 px-4 py-1.5 rounded-md transition-colors shadow-sm">
                        Update
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalOrders)}</span> of <span className="font-medium">{totalOrders}</span> results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {selectedOrderForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setSelectedOrderForPreview(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Order {selectedOrderForPreview.orderNumber}</h2>
              <p className="text-sm text-gray-500 mb-6 font-mono">{new Date(selectedOrderForPreview.createdAt).toLocaleString()}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                    <p className="text-sm font-medium text-gray-900">{selectedOrderForPreview.customer.fullName}</p>
                    <p className="text-sm text-gray-700">{selectedOrderForPreview.customer.phone}</p>
                    <p className="text-sm text-gray-700">{selectedOrderForPreview.customer.address}, {selectedOrderForPreview.customer.city}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order Info</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${selectedOrderForPreview.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                        ${selectedOrderForPreview.status === 'Confirmed' ? 'bg-indigo-100 text-indigo-800' : ''}
                        ${selectedOrderForPreview.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${selectedOrderForPreview.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                        ${selectedOrderForPreview.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                      `}>{selectedOrderForPreview.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Payment</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrderForPreview.paymentMethod || 'COD'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">{selectedOrderForPreview.totalAmount.toFixed(2)} MAD</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedOrderForPreview.customer.notes && (
                <div className="mb-8">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer Notes</h3>
                  <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-100 italic">&quot;{selectedOrderForPreview.customer.notes}&quot;</p>
                </div>
              )}

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order Items</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Material</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrderForPreview.items.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{item.name_fr}</div>
                            <div className="text-xs text-gray-500" dir="rtl">{item.name_ar}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.material || '-'}</td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">{item.price.toFixed(2)} MAD</td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)} MAD</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
