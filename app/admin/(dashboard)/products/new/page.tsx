import ProductForm from '@/components/admin/ProductForm';
import { connectToDatabase } from '@/lib/db';
import { Category } from '@/models/Category';

export default async function NewProductPage() {
  await connectToDatabase();
  const categories = await Category.find().lean();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedCategories = categories.map((c: any) => ({
    _id: c._id.toString(),
    name_fr: c.name_fr
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new piece of jewelry.</p>
      </div>

      <ProductForm categories={formattedCategories} />
    </div>
  );
}
