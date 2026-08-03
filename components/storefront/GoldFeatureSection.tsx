'use client';

import { useLocale, useTranslations } from 'next-intl';

export default function GoldFeatureSection() {
  const locale = useLocale();
  const t = useTranslations('Sections');

  return (
    <section className="py-24 bg-[#FAF8F5] text-black transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading "100% Gold" & Minimal Description */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display text-5xl sm:text-7xl font-bold tracking-tight text-[#121214]">
              {t('100percentGold')}
            </h2>

            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-light max-w-lg">
              {t('goldFeatureDesc')}
            </p>
          </div>

          {/* Right Column: Tall Vertical Image (No Rounded Corners, No Decoration) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[500px] aspect-[3/4] relative">
              <img
                src="/images/gold-collection.webp"
                alt="100% Gold Rouhi Collection"
                className="w-full h-full object-cover rounded-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
