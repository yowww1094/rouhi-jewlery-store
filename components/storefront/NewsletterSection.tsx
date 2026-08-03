'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = useTranslations('Newsletter');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="py-20 bg-[#FAF8F5] dark:bg-[#0B0B0C] border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-black dark:text-white">
              {t('title')}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm font-light leading-relaxed max-w-lg">
              {t('description')}
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="bg-[#C5A059]/10 border border-[#C5A059] text-[#C5A059] p-4 rounded-xl text-center text-sm font-semibold">
                {t('successMessage')}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('placeholder')}
                  required
                  className="flex-1 px-5 py-4 rounded-full bg-white dark:bg-[#141416] border border-zinc-300 dark:border-zinc-700 text-sm text-black dark:text-white focus:outline-none focus:border-[#C5A059] shadow-sm"
                />
                <button
                  type="submit"
                  className="gold-bg-btn px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase shrink-0 shadow-md"
                >
                  {t('subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
