'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function EditorialCollageSection() {
  const locale = useLocale();

  return (
    <section className="py-24 bg-[#FAF8F5] text-black border-t border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Big Statement Headline */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-title text-4xl sm:text-6xl font-bold tracking-tight text-[#121214] leading-[1.1]">
              {locale === 'ar' ? 'لكل شغف في مجموعتك' : 'For every passion in your repertoire'}
            </h2>
          </div>

          {/* Right Column: 6 Photo Collage Grid matching Figma */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { img: '/images/shop/bento-tall.webp', btn: 'SHOP NOW' },
              { img: '/images/shop/bento-short.webp', btn: 'SHOP NOW' },
              { img: '/images/shop/bento-tall.webp', btn: 'SHOP NOW' },
              { img: '/images/shop/bento-short.webp', btn: 'SHOP NOW' },
              { img: '/images/shop/bento-tall.webp', btn: 'SHOP NOW' },
              { img: '/images/shop/bento-short.webp', btn: 'SHOP NOW' },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group relative aspect-[3/4] overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-xl transition-all duration-300 flex items-end justify-center p-4"
              >
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.img}
                  alt="ROUHI Passion"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Overlay Button */}
                <Link
                  href="/products"
                  className="relative z-10 bg-white/90 hover:bg-white text-black px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all shadow-md"
                >
                  {card.btn}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
