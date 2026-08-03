'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateStoreSettings } from '@/actions/settings';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SettingsSchema = z.object({
  contactInfo: z.object({
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  })
});

type SettingsFormData = z.infer<typeof SettingsSchema>;

export default function SettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      contactInfo: {
        phone: initialData?.contactInfo?.phone || '',
        whatsapp: initialData?.contactInfo?.whatsapp || '',
        email: initialData?.contactInfo?.email || '',
        address: initialData?.contactInfo?.address || '',
        instagram: initialData?.contactInfo?.instagram || '',
        facebook: initialData?.contactInfo?.facebook || '',
      }
    }
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const result = await updateStoreSettings(data);

    if (result.success) {
      setSuccessMsg('Settings updated successfully!');
      router.refresh();
    } else {
      setErrorMsg(result.error || 'Something went wrong');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-sm max-w-3xl space-y-8">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100">
          {successMsg}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Contact Information</h3>
        <p className="text-sm text-gray-500 mb-6">These details will be displayed in the footer and contact sections across the storefront.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <input 
              {...register('contactInfo.email')} 
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" 
              placeholder="contact@rouhi.com"
            />
            {errors.contactInfo?.email && <p className="text-red-500 text-xs mt-1">{errors.contactInfo.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              {...register('contactInfo.phone')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" 
              placeholder="+212 6 XX XX XX XX"
            />
            {errors.contactInfo?.phone && <p className="text-red-500 text-xs mt-1">{errors.contactInfo.phone.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Address(es)</label>
            <textarea 
              {...register('contactInfo.address')} 
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white resize-none" 
              placeholder="Quartier Gauthier, Casablanca, Maroc..."
            />
            {errors.contactInfo?.address && <p className="text-red-500 text-xs mt-1">{errors.contactInfo.address.message}</p>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Social Media Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Link</label>
            <input 
              {...register('contactInfo.whatsapp')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" 
              placeholder="https://wa.me/2126..."
            />
            {errors.contactInfo?.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.contactInfo.whatsapp.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Link</label>
            <input 
              {...register('contactInfo.instagram')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" 
              placeholder="https://instagram.com/rouhi"
            />
            {errors.contactInfo?.instagram && <p className="text-red-500 text-xs mt-1">{errors.contactInfo.instagram.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Link</label>
            <input 
              {...register('contactInfo.facebook')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base shadow-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors bg-gray-50 focus:bg-white" 
              placeholder="https://facebook.com/rouhi"
            />
            {errors.contactInfo?.facebook && <p className="text-red-500 text-xs mt-1">{errors.contactInfo.facebook.message}</p>}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
