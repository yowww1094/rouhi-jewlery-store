'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function OurStorySection() {
  const t = useTranslations('Sections');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const locale = useLocale();

  return (
    <section id="our-story" className="py-16 bg-[#FAF8F5] text-black transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* ROW 1: Our Story (Gold Rings Image on Left, Heading & Description on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Two Interlocking Golden Rings Image (Seamless Background Sync) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative aspect-square max-w-[420px] w-full group">
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/our-story-gold-rings.webp"
                alt="Rouhi Golden Rings - Our Story"
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Our Story Heading & Paragraph */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#121214]">
              {t('ourStory')}
            </h2>

            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-light">
              {t('ourStoryDesc')}
            </p>
          </div>
        </div>

        {/* ROW 2: "Jewelry tells eternal stories" (Headline & Gold/Silver Specs on Left, Silver Ring Image on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Large Headline + Gold & Silver Dual Columns */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#121214] leading-[1.1]">
              {t('eternalStories')}
            </h2>

            {/* Gold & Silver Spec Columns Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Gold Specs */}
              <div className="space-y-1.5">
                <h3 className="font-display text-2xl font-bold text-[#C5A059]">
                  {t('gold')}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed font-light">
                  {t('goldSpecDesc')}
                </p>
              </div>

              {/* Silver Specs */}
              <div className="space-y-1.5">
                <h3 className="font-display text-2xl font-bold text-zinc-700">
                  {t('silver')}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed font-light">
                  {t('silverSpecDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Silver Ring Image (Seamless Background Sync) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative aspect-square max-w-[420px] w-full group">
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/our-story-silver-ring.webp"
                alt="Rouhi Silver Diamond Ring"
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
