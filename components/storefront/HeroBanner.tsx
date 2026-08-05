'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function HeroBanner() {
  const t = useTranslations('Hero');

  return (
    <section className="relative w-full min-h-[82vh] lg:min-h-[88vh] flex items-center overflow-hidden bg-[#0D0D0E] text-white">
      {/* Background Image in Full Cover Mode with Black Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.webp"
          alt="Rouhi Jewelry Cover Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-[80%_center] lg:object-center scale-105 transition-transform duration-1000 ease-out brightness-90"
        />
        {/* Rich Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      </div>

      {/* Hero Overlay Content & CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <div className="max-w-xl space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121214]/80 backdrop-blur-md text-[#C5A059] border border-[#C5A059]/40 text-xs font-semibold tracking-widest uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('featuredCategory')}</span>
          </div>

          {/* Impact Headline */}
          <div className="space-y-4">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15] drop-shadow-md">
              {t.rich('title', {
                highlight: (chunks) => <span className="text-[#C5A059] italic font-serif font-normal">{chunks}</span>,
                br: () => <br />
              })}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-zinc-300 text-base sm:text-lg max-w-lg leading-relaxed font-light drop-shadow-sm">
            {t('subtitle')}
          </p>

          {/* Primary CTA Button Taking User to Shop Page (/products) */}
          <div className="pt-6">
            <Link
              href="/products"
              className="gold-bg-btn px-9 py-4 rounded-full font-bold text-xs sm:text-sm tracking-[0.2em] uppercase flex sm:inline-flex items-center justify-center gap-3 shadow-2xl group border border-[#C5A059] w-full sm:w-auto"
            >
              <span>{t('cta')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
