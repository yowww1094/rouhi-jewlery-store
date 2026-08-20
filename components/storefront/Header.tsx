'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { Search, ShoppingBag, Menu, X, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import CartDrawer from './CartDrawer';

export default function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('products'), href: '/products' },
    { label: t('collections'), href: '/products?tab=collections' },
    { label: t('giftIdeas'), href: '/#gift-guide' },
    { label: t('contactUs'), href: '/contact' },
  ];

  const isHomePage = pathname === '/';

  // If we are on the home page and NOT scrolled, we want it transparent and absolute (overlaying the hero).
  // When scrolled, we want it fixed and white.
  // If we are on other pages, it's always sticky and white so it doesn't overlap content.
  const headerBaseClasses = "w-full z-40 transition-all duration-300";
  let headerClasses = "";
  
  if (isHomePage) {
    if (isScrolled) {
      headerClasses = "fixed top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-200 text-black animate-in slide-in-from-top-4";
    } else {
      headerClasses = "absolute bg-transparent text-white";
    }
  } else {
    headerClasses = "sticky top-0 bg-white shadow-sm border-b border-zinc-200 text-black";
  }

  const isTransparentState = isHomePage && !isScrolled;

  // Icon color handling based on transparent state
  const iconClass = isTransparentState 
    ? "text-white hover:text-[#C5A059]" 
    : "text-zinc-700 hover:text-[#C5A059]";

  return (
    <>
      <div className={`fixed top-0 w-full z-50 transition-transform duration-300 ${isHomePage && isScrolled ? '-translate-y-full' : 'translate-y-0 relative'}`}>
        {/* Announcement Bar */}
        <div className="bg-black text-white text-[9px] sm:text-[11px] text-center py-2 px-2 sm:px-4 uppercase tracking-[0.1em] sm:tracking-[0.2em] font-light w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 relative z-50">
          <span>{t('topBar')}</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <span className="flex items-center gap-1.5 sm:gap-2">
            <Truck className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse text-[#C5A059]" />
            {t('freeShippingLocal')}
          </span>
        </div>
      </div>
      
      <header className={`${headerBaseClasses} ${headerClasses} ${isHomePage && !isScrolled ? 'pt-8 sm:pt-10' : ''}`}>
        <div className="w-full px-6 sm:px-12 lg:px-16 h-20 sm:h-24 flex items-center justify-between">
          
          {/* 1. Brand Logo (Bigger) */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="inline-block relative">
              <Image 
                src="/images/logo.png" 
                alt={t('storeName')} 
                width={180} 
                height={70} 
                className={`h-14 sm:h-16 w-auto object-contain scale-[1.8] sm:scale-[2.2] ml-4 sm:ml-8 origin-left transition-all duration-300 ${isTransparentState ? 'brightness-0 invert' : ''}`}
                priority
              />
            </Link>
          </div>

          {/* 2. Middle Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-12 gap-12 font-medium tracking-wide text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const linkColor = isTransparentState 
                ? (isActive ? 'text-[#C5A059]' : 'text-white hover:text-[#C5A059]') 
                : (isActive ? 'text-black font-semibold' : 'text-[#292D32] hover:text-[#C5A059]');
                
              return (
                <div key={link.href} className="relative group py-2">
                  <Link href={link.href} className={`transition-colors ${linkColor}`}>
                    {link.label}
                  </Link>
                  {/* Active Bar indicator */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] transition-all duration-300 ${
                      isActive && !isTransparentState ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </div>
              );
            })}
          </nav>

          {/* 3. Right Controls: Language Switcher, Search, Cart */}
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher isTransparent={isTransparentState} />

            <Link href="/products" className={`p-2 transition-colors ${iconClass}`} title="Search">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>

            {/* Cart Icon with Badge */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className={`relative p-2 transition-colors ${iconClass}`}
              title={t('cart')}
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {mounted && cartCount > 0 && (
                <span className={`absolute top-0 right-0 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm ${isTransparentState ? 'bg-white text-black' : 'bg-[#C5A059] text-black'}`}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className={`lg:hidden p-2 ${iconClass}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200 px-6 py-6 space-y-4 text-sm font-medium tracking-wide text-[#292D32]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-[#C5A059] text-black"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

      </header>

      {/* Cart Drawer Overlay - Rendered outside of header to avoid stacking context issues */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </>
  );
}
