'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function CategoryPillsSection() {
  const locale = useLocale();

  const pills = [
    { label_fr: 'Bagues', label_ar: 'خواتم', href: '/products?category=Rings' },
    { label_fr: 'Bracelets', label_ar: 'أساور', href: '/products?category=Bracelets' },
    { label_fr: 'Boucles d’Oreilles', label_ar: 'أقراط', href: '/products?category=Earrings' },
    { label_fr: 'Charms', label_ar: 'تعليقات', href: '/products?category=Charms' },
    { label_fr: 'Colliers', label_ar: 'قلائد', href: '/products?category=Necklaces' },
    { label_fr: 'Argent 925', label_ar: 'فضة 925', href: '/products?material=silver' },
    { label_fr: 'Or 18k', label_ar: 'ذهب 18', href: '/products?material=gold' },
    { label_fr: 'Parures', label_ar: 'أطقم', href: '/products?category=Sets' },
  ];

  return (
    <section className="py-16 bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h3 className="font-title text-2xl sm:text-3xl font-bold tracking-tight text-[#121214] uppercase">
          {locale === 'ar' ? 'استكشف الكتالوج الخاص بنا' : 'EXPLORE OUR CATALOGO'}
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {pills.map((pill, idx) => (
            <Link
              key={idx}
              href={pill.href}
              className="px-6 py-2.5 bg-[#FAF8F5] border border-zinc-300 text-zinc-800 hover:border-black hover:bg-black hover:text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 rounded-full shadow-sm"
            >
              {locale === 'ar' ? pill.label_ar : pill.label_fr}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
