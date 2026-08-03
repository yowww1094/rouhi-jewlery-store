import { connectToDatabase } from '@/lib/db';
import { StoreSettings } from '@/models/StoreSettings';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  await connectToDatabase();
  const settings = await StoreSettings.findOne().lean();

  const formattedSettings = settings ? {
    ...settings,
    _id: settings._id.toString()
  } : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage global storefront information.</p>
      </div>

      <SettingsForm initialData={formattedSettings} />
    </div>
  );
}
