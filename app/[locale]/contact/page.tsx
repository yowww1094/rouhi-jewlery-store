import { setRequestLocale, getTranslations } from 'next-intl/server';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getContactInfo } from '@/lib/settings';
import ContactForm from '@/components/storefront/ContactForm';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const contactInfo = await getContactInfo();
  const t = await getTranslations('Contact');

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-[0.1em] text-black uppercase mb-4">
            {t('title')}
          </h1>
          <p className="text-sm md:text-base text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 border border-zinc-200 shadow-sm" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="font-display text-2xl font-bold text-black mb-6">
              {t('sendMessage')}
            </h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-10" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            
            <div className="flex items-start gap-4">
              <div className="p-4 bg-white border border-zinc-200 rounded-full shrink-0 shadow-sm">
                <MapPin className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-black mb-2">
                  {t('boutiques')}
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed">
                  {contactInfo?.address ? contactInfo.address.split('\n').map((line: string, i: number) => (
                    <span key={i}>{line}<br /></span>
                  )) : (
                    <>
                      Quartier Gauthier, Casablanca, Maroc
                      <br />
                      Agdal, Rabat, Maroc
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-4 bg-white border border-zinc-200 rounded-full shrink-0 shadow-sm">
                <Phone className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-black mb-2">
                  {t('phone')}
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed" dir="ltr">
                  {contactInfo?.phone || '+212 6 61 23 45 67'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-4 bg-white border border-zinc-200 rounded-full shrink-0 shadow-sm">
                <Mail className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-black mb-2">
                  {t('email')}
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed">
                  {contactInfo?.email || 'contact@rouhijewelry.ma'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-4 bg-white border border-zinc-200 rounded-full shrink-0 shadow-sm">
                <Clock className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-black mb-2">
                  {t('hours')}
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed">
                  {t('hoursWeek')}
                  <br />
                  {t('hoursSunday')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer contactInfo={contactInfo} />
    </div>
  );
}
