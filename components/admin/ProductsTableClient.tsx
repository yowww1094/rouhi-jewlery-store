'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Edit2, Trash2, Search, Filter, Eye, X } from 'lucide-react';
import { deleteProduct } from '@/actions/product';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function ProductsTableClient({ 
  products,
  currentPage,
  totalPages,
  totalProducts,
  initialSearch,
  initialStatus,
  initialTag
}: { 
  products: any[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  initialSearch: string;
  initialStatus: string;
  initialTag: string;
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [tagFilter, setTagFilter] = useState(initialTag);
  const [selectedProductForPreview, setSelectedProductForPreview] = useState<any>(null);
  const ITEMS_PER_PAGE = 10;
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Update URL whenever a filter is changed (and reset to page 1)
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset page on filter change
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateFilters('search', searchQuery);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };



  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search and press Enter..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                updateFilters('status', e.target.value === 'all' ? '' : e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={tagFilter}
              onChange={(e) => {
                setTagFilter(e.target.value);
                updateFilters('tag', e.target.value === 'all' ? '' : e.target.value);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none bg-white"
            >
              <option value="all">All Tags</option>
              <option value="featured">Featured</option>
              <option value="collection">Collection</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Tags</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product: any) => (
                <tr key={product._id.toString()}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                        {product.images?.[0] && (
                          <img className="h-10 w-10 object-cover" src={product.images[0]} alt="" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name_fr}</div>
                        <div className="text-sm text-gray-500">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.categories && product.categories.length > 0 
                      ? product.categories.map((c: any) => c.name_fr).join(', ') 
                      : 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">{(product.discountPrice || product.price).toFixed(2)} MAD</span>
                      {product.discountPrice && (
                        <span className="text-gray-400 text-xs line-through">{product.price.toFixed(2)} MAD</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.isActive ? 'Active' : 'Draft'}
                      </span>
                      {product.isFeatured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Featured
                        </span>
                      )}
                      {product.isCollection && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Collection
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedProductForPreview(product)}
                        className="text-zinc-600 hover:text-zinc-900 transition-colors"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link href={`/admin/products/${product._id}`} className="text-blue-600 hover:text-blue-900">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            await deleteProduct(product._id.toString());
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    No products found matching your search and filters.
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
              Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)}</span> of <span className="font-medium">{totalProducts}</span> results
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
      </div>

      {/* Quick View Modal */}
      {selectedProductForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setSelectedProductForPreview(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedProductForPreview.name_fr}</h2>
              <p className="text-sm text-gray-500 mb-6 font-mono">{selectedProductForPreview.slug}</p>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Images */}
                <div className="w-full md:w-5/12">
                  <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-3">
                    <img 
                      src={selectedProductForPreview.images?.[0] || '/images/shop/placeholder.png'} 
                      alt={selectedProductForPreview.name_fr}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  {selectedProductForPreview.images?.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedProductForPreview.images.slice(1).map((img: string, i: number) => (
                        <div key={i} className="w-16 h-16 shrink-0 bg-gray-50 rounded border border-gray-100 overflow-hidden">
                          <img src={img} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="w-full md:w-7/12 space-y-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Price</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{(selectedProductForPreview.discountPrice || selectedProductForPreview.price).toFixed(2)} MAD</span>
                        {selectedProductForPreview.discountPrice && (
                          <span className="text-sm text-gray-400 line-through">{selectedProductForPreview.price.toFixed(2)} MAD</span>
                        )}
                      </div>
                    </div>
                    <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedProductForPreview.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {selectedProductForPreview.isActive ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Material</h3>
                      <p className="text-sm text-gray-900 font-medium">{selectedProductForPreview.material}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Target</h3>
                      <p className="text-sm text-gray-900 font-medium">{selectedProductForPreview.targetAudience || 'Unisex'}</p>
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Categories</h3>
                      <p className="text-sm text-gray-900">
                        {selectedProductForPreview.categories?.map((c: any) => c.name_fr).join(', ') || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                  
                  {selectedProductForPreview.sizes?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Available Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProductForPreview.sizes.map((s: string) => (
                          <span key={s} className="px-3 py-1 bg-gray-100 text-sm rounded-md font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description (FR)</h3>
                      <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">{selectedProductForPreview.description_fr}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description (AR)</h3>
                      <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100 text-right font-arabic" dir="rtl">{selectedProductForPreview.description_ar}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
