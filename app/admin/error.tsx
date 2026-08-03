'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm m-6">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Error
        </h1>
        <p className="text-gray-500 max-w-md text-sm mx-auto">
          Something went wrong while loading this section of the dashboard.
          <br />
          <span className="text-red-500 mt-2 block">{error.message || 'An unexpected error occurred.'}</span>
        </p>
      </div>
      <div className="flex gap-4 justify-center pt-2">
        <button
          onClick={() => reset()}
          className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium rounded-lg"
        >
          Try again
        </button>
        <Link
          href="/admin"
          className="px-6 py-2 bg-black text-white hover:bg-zinc-800 transition-colors text-sm font-medium rounded-lg"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
