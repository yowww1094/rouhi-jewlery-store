import { Link } from '@/i18n/routing';
import { Search } from 'lucide-react';
import Header from '@/components/storefront/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mx-auto mb-2 shadow-sm">
          <Search className="w-8 h-8" />
        </div>
        <div>
          <h1 className="font-display text-4xl font-bold text-black mb-4">
            404 - Page introuvable
          </h1>
          <p className="text-zinc-600 max-w-md text-sm mx-auto leading-relaxed">
            La page que vous recherchez n'existe pas ou a été déplacée. 
            <br />
            (The page you are looking for does not exist or has been moved.)
          </p>
        </div>
        <div className="pt-6">
          <Link
            href="/"
            className="px-10 py-4 bg-black text-white hover:bg-zinc-800 transition-colors text-xs font-bold uppercase tracking-widest shadow-sm inline-block"
          >
            Retour à l'accueil (Back Home)
          </Link>
        </div>
      </div>
    </div>
  );
}
