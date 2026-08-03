import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Clock 
} from 'lucide-react';
import RevenueChart from '@/components/admin/RevenueChart';
import TopProducts from '@/components/admin/TopProducts';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const [
    totalOrders, 
    pendingOrders, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deliveredOrders, 
    totalProducts, 
    orders,
    monthlyRevenueDataRaw,
    topProductsDataRaw
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'Pending' }),
    Order.countDocuments({ status: 'Delivered' }),
    Product.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    
    // Monthly Revenue Aggregation
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]),

    // Top Sold Products Aggregation
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ])
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Format Monthly Revenue Data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedMonthlyRevenue = monthlyRevenueDataRaw.map(item => ({
    name: months[item._id - 1],
    revenue: item.revenue
  }));

  // Fetch actual product details for the top products
  const productIds = topProductsDataRaw.map(p => p._id);
  const productsList = await Product.find({ _id: { $in: productIds } }).lean();

  const formattedTopProducts = topProductsDataRaw.map(agg => {
    const aggIdStr = agg._id ? agg._id.toString() : 'unknown';
    const p = productsList.find(prod => prod._id?.toString() === aggIdStr);
    return {
      _id: aggIdStr,
      name: p ? p.name_fr : 'Unknown Product',
      imageUrl: p?.images?.[0] || '',
      totalSold: agg.totalSold,
      revenue: agg.revenue
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Key metrics and recent activity.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue (Recent)</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{totalRevenue.toFixed(2)} MAD</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{totalOrders}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{pendingOrders}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{totalProducts}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts Grid (70% / 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Monthly Revenue</h2>
            <p className="text-sm text-gray-500 mt-1">Revenue across all non-cancelled orders.</p>
          </div>
          <RevenueChart data={formattedMonthlyRevenue} />
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">Most Sold Products</h2>
            <p className="text-sm text-gray-500 mt-1">Top products by quantity sold.</p>
          </div>
          <TopProducts products={formattedTopProducts} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id.toString()}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer.fullName}
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
                      ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
