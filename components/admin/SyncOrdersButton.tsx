'use client';

import { useState } from 'react';
import { syncOrdersAction, pullOrdersAction } from '@/actions/order';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RefreshCw, DownloadCloud, UploadCloud } from 'lucide-react';

export default function SyncOrdersButton() {
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const handlePush = async () => {
    setIsPushing(true);
    try {
      const result = await syncOrdersAction();
      if (result.success) {
        alert('Orders pushed successfully to Google Sheets!');
      } else {
        alert('Failed to push: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred during push.');
    } finally {
      setIsPushing(false);
    }
  };

  const handlePull = async () => {
    setIsPulling(true);
    try {
      const result = await pullOrdersAction();
      if (result.success) {
        alert(`Successfully pulled from Google Sheets! Updated ${result.updatedCount} orders.`);
      } else {
        alert('Failed to pull: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred during pull.');
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePull}
        disabled={isPulling || isPushing}
        className="flex items-center gap-2 bg-white border border-zinc-200 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors disabled:opacity-50"
      >
        <DownloadCloud className={`w-4 h-4 ${isPulling ? 'animate-bounce' : ''}`} />
        {isPulling ? 'Pulling...' : 'Pull from Sheets'}
      </button>

      <button
        onClick={handlePush}
        disabled={isPushing || isPulling}
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        <UploadCloud className={`w-4 h-4 ${isPushing ? 'animate-bounce' : ''}`} />
        {isPushing ? 'Pushing...' : 'Push to Sheets'}
      </button>
    </div>
  );
}
