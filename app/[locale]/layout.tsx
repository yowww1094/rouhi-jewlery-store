import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Tajawal } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ROUHI | Haute Joaillerie Maroc - Or 18k & Argent 925',
  description: 'Maison de haute joaillerie au Maroc. Vente en ligne de bijoux d\'exception en or 18 carats et argent massif 925. Livraison sécurisée et paiement à la livraison.',
  keywords: ['joaillerie maroc', 'bijoux or 18k', 'argent 925', 'rouhi jewelry', 'bijouterie en ligne maroc'],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "fr" | "ar")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${plusJakarta.variable} ${tajawal.variable}`}>
      <body className={`min-h-screen bg-[#FAF8F5] text-[#121214] antialiased overflow-x-hidden ${locale === 'ar' ? 'font-tajawal' : 'font-plus-jakarta'}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
