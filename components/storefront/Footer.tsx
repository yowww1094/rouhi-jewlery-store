'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Phone, Mail, MapPin, Share2 } from 'lucide-react';

export default function Footer({ 
  contactInfo 
}: { 
  contactInfo?: { 
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    instagram: string;
    facebook: string;
  } 
}) {
  const t = useTranslations('Footer');
  const h = useTranslations('Header');


  return (
    <>
    <footer id="footer" className="bg-white text-black pt-16 pb-12 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Image 
              src="/images/logo.png" 
              alt={h('storeName')} 
              width={300} 
              height={120} 
              className="h-20 sm:h-24 w-auto object-contain block"
            />
            <p className="text-zinc-600 text-xs leading-relaxed max-w-sm font-light">
              {t('description')}
            </p>
            <div className="flex items-center gap-4 text-zinc-600 pt-2">
              <a
                href={contactInfo?.instagram || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A059] transition-colors p-2.5 bg-zinc-100 rounded-full"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={contactInfo?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A059] transition-colors p-2.5 bg-zinc-100 rounded-full"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
              <a
                href={contactInfo?.whatsapp || "https://wa.me/212661234567"}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#C5A059] transition-colors p-2.5 bg-zinc-100 rounded-full"
                title="WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#C5A059] uppercase">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 font-light tracking-wide">
              <li>
                <Link href="/" className="hover:text-black transition-colors">
                  {h('home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-black transition-colors">
                  {h('products')}
                </Link>
              </li>
              <li>
                <Link href="/products?tab=collections" className="hover:text-black transition-colors">
                  {h('collections')}
                </Link>
              </li>
              <li>
                <Link href="/#gift-guide" className="hover:text-black transition-colors">
                  {h('giftIdeas')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  {h('contactUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Assistance */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#C5A059] uppercase">
              Assistance
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 font-light tracking-wide">
              <li>
                <Link href="/checkout" className="hover:text-black transition-colors">
                  Paiement à la livraison
                </Link>
              </li>
              <li>
                <Link href="/#our-story" className="hover:text-black transition-colors">
                  Guide des Tailles
                </Link>
              </li>
              <li>
                <Link href="/#our-story" className="hover:text-black transition-colors">
                  Politique de Retour
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  {h('contactUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-widest text-[#C5A059] uppercase">
              {t('contact')}
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-600 font-light">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                <span className="whitespace-pre-line">{contactInfo?.address || 'Casablanca & Rabat, Maroc'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>{contactInfo?.phone || '+212 6 61 23 45 67'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059]" />
                <span>{contactInfo?.email || 'contact@rouhijewelry.ma'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-light">
          <p>© 2026 Maison Rouhi Joaillerie. {t('rights')}</p>
          <p className="mt-2 sm:mt-0">Fait avec passion pour ROUHI</p>
        </div>
      </div>
    </footer>
      {/* Sticky WhatsApp Button */}
      {true && (
        <a
          href={contactInfo?.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
          title="Chat on WhatsApp"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          {/* Optional pulsing effect */}
          <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></span>
        </a>
      )}
    </>
  );
}
