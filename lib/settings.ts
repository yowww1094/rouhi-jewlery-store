import { connectToDatabase } from '@/lib/db';
import { StoreSettings } from '@/models/StoreSettings';

export async function getContactInfo() {
  try {
    const fetchPromise = (async () => {
      await connectToDatabase();
      const settings = await StoreSettings.findOne().lean().exec();
      if (!settings || !settings.contactInfo) {
        return null;
      }
      return JSON.parse(JSON.stringify(settings.contactInfo));
    })();

    // 500ms timeout fallback to prevent hanging UI
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 500));

    return await Promise.race([fetchPromise, timeoutPromise]) as any;
  } catch (error) {
    return null;
  }
}
