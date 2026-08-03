'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function Error({
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
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto mb-2 shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-black mb-4">
          Oups! Une erreur s'est produite.
        </h1>
        <p className="text-zinc-600 max-w-md text-sm mx-auto">
          Nous sommes désolés, mais une erreur inattendue s'est produite lors du chargement de cette page. Veuillez réessayer.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 w-full sm:w-auto">
        <button
          onClick={() => reset()}
          className="px-8 py-3.5 border border-black text-black hover:bg-black hover:text-white transition-colors text-xs font-bold uppercase tracking-widest shadow-sm w-full sm:w-auto"
        >
          Réessayer (Try again)
        </button>
        <Link
          href="/"
          className="px-8 py-3.5 bg-[#C5A059] text-black hover:bg-[#B38D45] transition-colors text-xs font-bold uppercase tracking-widest shadow-sm w-full sm:w-auto block"
        >
          Accueil (Home)
        </Link>
      </div>
    </div>
  );
}
