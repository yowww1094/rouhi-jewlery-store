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
        <div className="text-center mb-20">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-black mb-6 tracking-wide">
            {t('title')}
          </h1>
          <p className="text-sm md:text-base text-zinc-500 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 border border-[#E2E0D8] shadow-sm rounded-sm" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <h2 className="text-xl md:text-2xl font-light text-black mb-8 tracking-wide uppercase">
              {t('sendMessage')}
            </h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-12 lg:pl-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            
            <div className="flex items-start gap-6 group">
              <div className="p-4 bg-[#FAF8F5] border border-[#E2E0D8] rounded-full shrink-0 group-hover:border-[#C5A059] transition-colors">
                <MapPin className="w-5 h-5 text-[#C5A059]" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h3 className="text-xs font-bold tracking-widest text-black mb-3 uppercase">
                  {t('boutiques')}
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed text-sm">
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

            <div className="flex items-start gap-6 group">
              <div className="p-4 bg-[#FAF8F5] border border-[#E2E0D8] rounded-full shrink-0 group-hover:border-[#C5A059] transition-colors">
                <Phone className="w-5 h-5 text-[#C5A059]" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h3 className="text-xs font-bold tracking-widest text-black mb-3 uppercase">
                  {t('phone')}
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed text-sm" dir="ltr">
                  {contactInfo?.phone || '+212 6 61 23 45 67'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="p-4 bg-[#FAF8F5] border border-[#E2E0D8] rounded-full shrink-0 group-hover:border-[#C5A059] transition-colors">
                <Mail className="w-5 h-5 text-[#C5A059]" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h3 className="text-xs font-bold tracking-widest text-black mb-3 uppercase">
                  {t('email')}
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed text-sm">
                  {contactInfo?.email || 'contact@rouhijewelry.ma'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="p-4 bg-[#FAF8F5] border border-[#E2E0D8] rounded-full shrink-0 group-hover:border-[#C5A059] transition-colors">
                <Clock className="w-5 h-5 text-[#C5A059]" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <h3 className="text-xs font-bold tracking-widest text-black mb-3 uppercase">
                  {t('hours')}
                </h3>
                <p className="text-zinc-600 font-light leading-relaxed text-sm">
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
