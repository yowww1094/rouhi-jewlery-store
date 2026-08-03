import ProductForm from '@/components/admin/ProductForm';
import { connectToDatabase } from '@/lib/db';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  
  const [product, categories] = await Promise.all([
    Product.findById(id).lean(),
    Category.find().lean()
  ]);

  if (!product) {
    notFound();
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedCategories = categories.map((c: any) => ({
    _id: c._id.toString(),
    name_fr: c.name_fr
  }));

  const formattedProduct = {
    ...product,
    _id: product._id.toString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: product.categories?.map((c: any) => c.toString()) || [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-1">Update jewelry details.</p>
      </div>

      <ProductForm initialData={formattedProduct} categories={formattedCategories} />
    </div>
  );
}
