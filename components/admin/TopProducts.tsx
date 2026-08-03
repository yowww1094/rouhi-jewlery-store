import Image from 'next/image';

interface TopProduct {
  _id: string;
  name: string;
  imageUrl: string;
  totalSold: number;
  revenue: number;
}

export default function TopProducts({ products }: { products: TopProduct[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-sm text-gray-500">
        No sales data yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <div key={product._id} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{product.totalSold} items sold</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{product.revenue.toFixed(2)} MAD</p>
          </div>
        </div>
      ))}
    </div>
  );
}
