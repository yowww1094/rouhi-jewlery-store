import { connectToDatabase } from '@/lib/db';
import { Category } from '@/models/Category';
import CategoriesTableClient from '@/components/admin/CategoriesTableClient';

export default async function AdminCategoriesPage() {
  await connectToDatabase();
  
  const categories = await Category.find().sort({ createdAt: -1 }).lean();
  const plainCategories = JSON.parse(JSON.stringify(categories));

  return <CategoriesTableClient initialCategories={plainCategories} />;
}
