'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createProduct, updateProduct } from '@/actions/product';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, X, Upload } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

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
  isGift: z.boolean(),
});

type ProductFormData = z.infer<typeof ProductSchema>;

export default function ProductForm({ 
  initialData, 
  categories 
}: { 
  initialData?: any;
  categories: { _id: string; name_fr: string }[];
}) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema) as any,
    defaultValues: initialData || {
      name_fr: '',
      name_ar: '',
      description_fr: '',
      description_ar: '',
      price: 0,
      material: 'Gold',
      slug: '',
      images: [],
      categories: initialData?.categories?.map((c: any) => c._id?.toString() || c.toString()) || [],
      targetAudience: initialData?.targetAudience || 'Unisex',
      isActive: true,
      isFeatured: false,
      isCollection: false,
      isGift: false,
    }
  });

  const images = watch('images');

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setErrorMsg('');
    
    // Ensure non-collections only have 1 category
    const payload = {
      ...data,
      categories: data.isCollection ? data.categories : (data.categories.length > 0 ? [data.categories[0]] : []),
    };

    const result = isEditing 
      ? await updateProduct(initialData._id.toString(), payload)
      : await createProduct(payload);

    if (result.success) {
      router.push('/admin/products');
      router.refresh();
    } else {
      setErrorMsg(result.error || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm max-w-4xl">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* French Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">French Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (FR)</label>
            <input {...register('name_fr')} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" />
            {errors.name_fr && <p className="text-red-500 text-xs mt-1">{errors.name_fr.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
            <textarea {...register('description_fr')} rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" />
            {errors.description_fr && <p className="text-red-500 text-xs mt-1">{errors.description_fr.message}</p>}
          </div>
        </div>

        {/* Arabic Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Arabic Content</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (AR)</label>
            <input {...register('name_ar')} dir="rtl" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" />
            {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (AR)</label>
            <textarea {...register('description_ar')} dir="rtl" rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" />
            {errors.description_ar && <p className="text-red-500 text-xs mt-1">{errors.description_ar.message}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Info</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (MAD)</label>
              <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (MAD)</label>
              <input type="number" step="0.01" {...register('discountPrice', { setValueAs: (v) => v === '' ? undefined : parseFloat(v) })} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <select {...register('material')} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white">
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select {...register('targetAudience')} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white">
                <option value="Unisex">Unisex</option>
                <option value="Women">Women</option>
                <option value="Men">Men</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category {watch('isCollection') ? '(Select multiple for collection)' : ''}
            </label>
            {watch('isCollection') ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {categories.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input 
                      type="checkbox" 
                      value={cat._id} 
                      {...register('categories')}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">{cat.name_fr}</span>
                  </label>
                ))}
              </div>
            ) : (
              <select 
                value={watch('categories')[0] || ''} 
                onChange={(e) => setValue('categories', e.target.value ? [e.target.value] : [])}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white"
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name_fr}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isActive')} className="rounded border-gray-300 text-black focus:ring-black" />
              <span className="text-sm font-medium text-gray-700">Active (Visible)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isFeatured')} className="rounded border-gray-300 text-black focus:ring-black" />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isCollection')} className="rounded border-gray-300 text-black focus:ring-black" />
              <span className="text-sm font-medium text-gray-700">Is Collection</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('isGift')} className="rounded border-gray-300 text-black focus:ring-black" />
              <span className="text-sm font-medium text-gray-700">Is Gift?</span>
            </label>
          </div>
        </div>

        {/* Media & Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Media & Options</h3>
          
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Images (Cloudinary)</label>
              <p className="text-xs text-gray-500">
                Recommended resolutions:<br/>
                • <strong>Square (1:1):</strong> 1080x1080px (Best for catalogs and thumbnails)<br/>
                • <strong>Portrait (4:5):</strong> 1080x1350px (Best for detailed product views)<br/>
                Ensure images are high-quality with minimal empty background space.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setValue('images', images.filter((_, index) => index !== i))} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 hover:bg-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <CldUploadWidget 
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "rouhi_jewelry"} 
              onSuccess={(result: any) => {
                const originalUrl = result.info.secure_url;
                // Apply 1080x1080 1:1 padding automatically (background removal removed as add-on is missing)
                const transformedUrl = originalUrl.replace(
                  '/upload/', 
                  '/upload/w_1080,h_1080,c_pad,b_auto,f_webp/'
                );
                setValue('images', [...images, transformedUrl]);
              }}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
              )}
            </CldUploadWidget>
            {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:bg-gray-400">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}
