'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function MarqueeTicker() {
  const t = useTranslations('Marquee');
  const locale = useLocale();

  const items = [
    t('item2'), // OR 18 CARATS CERTIFIÉ
    t('item3'), // ARGENT MASSIF 925
    t('item4'), // PAIEMENT À LA LIVRAISON
    t('item5'), // EXPÉDITION RAPIDE
  ];

  return (
    <div className="bg-[#121214] text-[#C5A059] border-y border-zinc-800 py-4 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center font-display text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] font-bold uppercase">
          {items.map((text, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="text-zinc-600 text-[10px] hidden sm:block">◆</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
