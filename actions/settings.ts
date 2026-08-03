'use server';

import { connectToDatabase } from '@/lib/db';
import { StoreSettings } from '@/models/StoreSettings';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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

export async function updateStoreSettings(data: z.infer<typeof SettingsSchema>) {
  try {
    const validatedData = SettingsSchema.parse(data);
    await connectToDatabase();
    
    let settings = await StoreSettings.findOne();
    if (settings) {
      settings.contactInfo = {
        phone: validatedData.contactInfo.phone || '',
        whatsapp: validatedData.contactInfo.whatsapp || '',
        email: validatedData.contactInfo.email || '',
        address: validatedData.contactInfo.address || '',
        instagram: validatedData.contactInfo.instagram || '',
        facebook: validatedData.contactInfo.facebook || '',
      };
      await settings.save();
    } else {
      settings = new StoreSettings({
        contactInfo: {
          phone: validatedData.contactInfo.phone || '',
          whatsapp: validatedData.contactInfo.whatsapp || '',
          email: validatedData.contactInfo.email || '',
          address: validatedData.contactInfo.address || '',
          instagram: validatedData.contactInfo.instagram || '',
          facebook: validatedData.contactInfo.facebook || '',
        }
      });
      await settings.save();
    }

    // Revalidate paths that might show contact information
    revalidatePath('/', 'layout'); // affects footer globally
    revalidatePath('/admin/settings');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating store settings:', error);
    return { success: false, error: error.message || 'Failed to update store settings' };
  }
}
