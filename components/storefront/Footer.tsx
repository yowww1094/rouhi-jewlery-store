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
                <Link href="/products" className="hover:text-black transition-colors">
                  {h('products')}
                </Link>
              </li>
              <li>
                <Link href="/products?material=gold" className="hover:text-black transition-colors">
                  Joaillerie Or 18k
                </Link>
              </li>
              <li>
                <Link href="/products?material=silver" className="hover:text-black transition-colors">
                  Joaillerie Argent 925
                </Link>
              </li>
              <li>
                <Link href="/products?category=collections" className="hover:text-black transition-colors">
                  {h('collections')}
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
  );
}
