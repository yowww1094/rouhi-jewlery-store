'use client';

import { useState } from 'react';
import { pullOrdersAction } from '@/actions/order';
import { DownloadCloud } from 'lucide-react';

export default function SyncOrdersButton() {
  const [isPulling, setIsPulling] = useState(false);

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
        disabled={isPulling}
        className="flex items-center gap-2 bg-white border border-zinc-200 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors disabled:opacity-50"
      >
        <DownloadCloud className={`w-4 h-4 ${isPulling ? 'animate-bounce' : ''}`} />
        {isPulling ? 'Pulling...' : 'Pull from Sheets'}
      </button>
    </div>
  );
}
