'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function BestCollectionsBanner() {
  const locale = useLocale();

  return (
    <section className="bg-[#1E1E1E] text-white py-24 border-y border-zinc-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Framed Pearl & Jewelry Image (Square / Sharp Corners) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-none overflow-hidden border border-zinc-700/80 group">
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/best-collections-pink.webp"
                alt="ROUHI Best Collections"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right Column: Collection Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold">
              {locale === 'ar' ? 'راحة وفخامة' : 'Comfort'}
            </span>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {locale === 'ar' ? 'أفضل مجموعات روحي' : 'ROUHI’S Best Collections'}
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-lg font-light">
              {locale === 'ar'
                ? 'التشكيلة النهائية للاحتفال بأناقة وأسلوب رفيع في كل المناسبات.'
                : 'The definitive selection to celebrate in style. Lorem ipsum dolor sit amet consectetur. Sed commodo pellentesque arcu tristique et morbi.'}
            </p>

            <div className="pt-4">
              <Link
                href="/products?category=collections"
                className="inline-block border border-white text-white hover:bg-white hover:text-black font-semibold text-xs tracking-[0.15em] uppercase px-8 py-4 rounded-none transition-all duration-300 shadow-lg"
              >
                {locale === 'ar' ? 'اكتشف المجموعة' : 'Découvrir la collection'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
