'use server';

import { connectToDatabase } from '@/lib/db';
import { Category } from '@/models/Category';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const CategorySchema = z.object({
  name_fr: z.string().min(1, 'Name (FR) is required'),
  name_ar: z.string().min(1, 'Name (AR) is required'),
});

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD') // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/(^-|-$)+/g, ''); // Remove trailing/leading dashes
}

export async function createCategory(data: z.infer<typeof CategorySchema>) {
  try {
    const validated = CategorySchema.parse(data);
    await connectToDatabase();
    
    let baseSlug = generateSlug(validated.name_fr);
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await Category.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newCategory = new Category({
      name_fr: validated.name_fr,
      name_ar: validated.name_ar,
      slug,
    });

    await newCategory.save();
    revalidatePath('/admin/categories');
    return { success: true, categoryId: newCategory._id.toString() };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message || 'Failed to create category' };
  }
}

export async function updateCategory(id: string, data: z.infer<typeof CategorySchema>) {
  try {
    const validated = CategorySchema.parse(data);
    await connectToDatabase();

    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    // Only update slug if name_fr changed
    if (category.name_fr !== validated.name_fr) {
      let baseSlug = generateSlug(validated.name_fr);
      let slug = baseSlug;
      let counter = 1;
      
      while (await Category.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      category.slug = slug;
    }

    category.name_fr = validated.name_fr;
    category.name_ar = validated.name_ar;

    await category.save();
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message || 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectToDatabase();
    await Category.findByIdAndDelete(id);
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message || 'Failed to delete category' };
  }
}
