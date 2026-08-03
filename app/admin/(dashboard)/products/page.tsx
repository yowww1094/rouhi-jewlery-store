import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import '@/models/Category';
import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { deleteProduct } from '@/actions/product';
import ProductsTableClient from '@/components/admin/ProductsTableClient';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  await connectToDatabase();

  const params = await searchParams;
  const page = parseInt(params.page as string) || 1;
  const ITEMS_PER_PAGE = 10;
  
  const search = params.search as string || '';
  const statusFilter = params.status as string || 'all';
  const tagFilter = params.tag as string || 'all';

  // Build the Mongoose query based on filters
  const query: any = {};

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { name_fr: searchRegex },
      { name_ar: searchRegex },
      { description_fr: searchRegex },
      { description_ar: searchRegex }
    ];
  }

  if (statusFilter === 'active') query.isActive = true;
  if (statusFilter === 'draft') query.isActive = false;

  if (tagFilter === 'featured') query.isFeatured = true;
  if (tagFilter === 'collection') query.isCollection = true;

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const products = await Product.find(query)
    .populate('categories')
    .sort({ createdAt: -1 })
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your jewelry catalog.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <ProductsTableClient 
        products={JSON.parse(JSON.stringify(products))} 
        currentPage={page}
        totalPages={totalPages}
        totalProducts={totalProducts}
        initialSearch={search}
        initialStatus={statusFilter}
        initialTag={tagFilter}
      />
    </div>
  );
}
