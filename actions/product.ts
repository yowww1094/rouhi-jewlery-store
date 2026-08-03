'use server';

import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const ProductSchema = z.object({
  name_fr: z.string().min(1, 'Name (FR) is required'),
  name_ar: z.string().min(1, 'Name (AR) is required'),
  description_fr: z.string().min(1, 'Description (FR) is required'),
  description_ar: z.string().min(1, 'Description (AR) is required'),
  price: z.number().min(0, 'Price must be positive'),
  discountPrice: z.number().optional().nullable(),
  material: z.enum(['Gold', 'Silver']),
  slug: z.string().optional().nullable(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  categories: z.array(z.string()).default([]),
  targetAudience: z.enum(['Men', 'Women', 'Unisex']).default('Unisex'),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isCollection: z.boolean(),
  isGift: z.boolean().default(false),
});

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function createProduct(data: z.infer<typeof ProductSchema>) {
  try {
    const validatedData = ProductSchema.parse(data);
    await connectToDatabase();
    
    // Auto-generate slug if missing
    let slug = validatedData.slug;
    if (!slug) {
      slug = generateSlug(validatedData.name_fr);
      // Ensure unique slug
      let existing = await Product.findOne({ slug });
      let counter = 1;
      while (existing) {
        slug = `${generateSlug(validatedData.name_fr)}-${counter}`;
        existing = await Product.findOne({ slug });
        counter++;
      }
    } else {
      const existing = await Product.findOne({ slug });
      if (existing) {
        return { success: false, error: 'Slug already exists' };
      }
    }

    const product = new Product({ ...validatedData, slug });
    await product.save();
    
    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/products');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message || 'Failed to create product' };
  }
}

export async function updateProduct(id: string, data: z.infer<typeof ProductSchema>) {
  try {
    const validatedData = ProductSchema.parse(data);
    await connectToDatabase();
    
    let slug = validatedData.slug;
    if (!slug) {
      slug = generateSlug(validatedData.name_fr);
    }

    // Check if slug exists and belongs to another product
    const existing = await Product.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      return { success: false, error: 'Slug already exists on another product' };
    }

    await Product.findByIdAndUpdate(id, { ...validatedData, slug });
    
    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${validatedData.slug}`);
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message || 'Failed to update product' };
  }
}

export async function deleteProduct(id: string) {
  try {
    await connectToDatabase();
    await Product.findByIdAndDelete(id);
    
    revalidatePath('/admin/products');
    revalidatePath('/');
    revalidatePath('/products');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message || 'Failed to delete product' };
  }
}
