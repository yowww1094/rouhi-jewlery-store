'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import CartDrawer from './CartDrawer';

export default function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('products'), href: '/products' },
    { label: t('collections'), href: '/products?tab=collections' },
    { label: t('giftIdeas'), href: '/#gift-guide' },
    { label: t('contactUs'), href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white text-black border-b border-zinc-200 shadow-sm transition-colors">
      {/* Top Section: Brand & Right Action Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-block">
            <span className="font-display text-3xl sm:text-5xl font-extrabold tracking-[0.15em] text-black uppercase">
              {t('storeName')}
            </span>
          </Link>
        </div>

        {/* Right Controls: Search, Language Switcher, Cart */}
        <div className="flex items-center gap-3 sm:gap-5">
          <LanguageSwitcher />

          <Link
            href="/products"
            className="p-2 text-zinc-700 hover:text-[#C5A059] transition-colors"
            title="Search"
          >
            <Search className="w-6 h-6" />
          </Link>

          {/* Cart Icon with Badge */}
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="relative p-2 text-zinc-700 hover:text-[#C5A059] transition-colors"
            title={t('cart')}
          >
            <ShoppingBag className="w-6 h-6" />
            {mounted && cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#C5A059] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="lg:hidden p-2 text-zinc-800 hover:text-[#C5A059]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Divider Line between Brand Section & Navigation Row */}
      <div className="w-full border-t border-zinc-200" />

      {/* Bottom Section: 2nd Navigation Row matching Figma */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-10 h-12 text-sm font-medium tracking-wide text-[#292D32]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.href} className="relative group py-3">
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-[#C5A059] ${
                    isActive ? 'text-black font-semibold' : 'text-[#292D32]'
                  }`}
                >
                  {link.label}
                </Link>
                {/* Yellow/Gold Active Bar indicator matching Figma */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] transition-all duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                />
              </div>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-zinc-200 px-6 py-6 space-y-4 text-sm font-medium tracking-wide text-[#292D32]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 hover:text-[#C5A059]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Cart Drawer Overlay */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  );
}
