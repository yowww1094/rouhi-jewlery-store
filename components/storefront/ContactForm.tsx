'use client';

import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('Contact');

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">
            {t('fullName')}
          </label>
          <input type="text" className="w-full px-4 py-3 bg-[#FAF8F5] border border-zinc-200 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">
            {t('phone')}
          </label>
          <input type="tel" className="w-full px-4 py-3 bg-[#FAF8F5] border border-zinc-200 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-colors" dir="ltr" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">
          {t('email')}
        </label>
        <input type="email" className="w-full px-4 py-3 bg-[#FAF8F5] border border-zinc-200 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-colors" dir="ltr" />
      </div>
      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-widest mb-2">
          {t('message')}
        </label>
        <textarea rows={5} className="w-full px-4 py-3 bg-[#FAF8F5] border border-zinc-200 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] outline-none transition-colors resize-none"></textarea>
      </div>
      <button 
        type="button" 
        onClick={() => alert(t('successMsg'))} 
        className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
      >
        {t('submit')}
      </button>
    </form>
  );
}
