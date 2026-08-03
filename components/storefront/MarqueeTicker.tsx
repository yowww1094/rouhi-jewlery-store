'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function MarqueeTicker() {
  const t = useTranslations('Marquee');
  const locale = useLocale();

  const items = [
    t('item1'),
    t('item2'),
    t('item3'),
    t('item4'),
    t('item5'),
    t('item6')
  ];

  return (
    <div className="bg-[#121214] text-[#C5A059] border-y border-zinc-800 py-4 overflow-hidden select-none">
      <div className={`gap-12 font-display text-lg tracking-[0.2em] font-bold uppercase ${locale === 'ar' ? 'animate-marquee-rtl' : 'animate-marquee-ltr'}`}>
        {items.concat(items, items, items).map((text, idx) => (
          <div key={idx} className="flex items-center gap-12 shrink-0">
            <span>{text}</span>
            <span className="text-zinc-600 text-xs">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
