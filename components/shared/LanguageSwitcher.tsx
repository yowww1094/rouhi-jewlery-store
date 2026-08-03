'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = (newLocale: 'fr' | 'ar') => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        className="flex items-center gap-1.5 p-2 text-zinc-700 hover:text-[#C5A059] transition-colors rounded-full text-xs font-medium uppercase tracking-wider"
      >
        <Globe className="w-5 h-5" />
        <span className="font-semibold">{locale.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 ltr:right-0 rtl:left-0 mt-2 w-36 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 py-1.5 text-xs font-medium text-black transition-all animate-in fade-in slide-in-from-top-1">
          <button
            onClick={() => toggleLanguage('fr')}
            className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-100 transition-colors ${
              locale === 'fr' ? 'text-[#C5A059] font-bold bg-[#FAF8F5]' : 'text-zinc-700'
            }`}
          >
            <span>Français (FR)</span>
            {locale === 'fr' && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
          </button>

          <button
            onClick={() => toggleLanguage('ar')}
            className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-100 transition-colors ${
              locale === 'ar' ? 'text-[#C5A059] font-bold bg-[#FAF8F5]' : 'text-zinc-700'
            }`}
          >
            <span>العربية (AR)</span>
            {locale === 'ar' && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
          </button>
        </div>
      )}
    </div>
  );
}
