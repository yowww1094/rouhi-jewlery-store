'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations('Cart');
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 ${
          locale === 'ar' ? 'left-0' : 'right-0'
        } w-full sm:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen
            ? 'translate-x-0'
            : locale === 'ar'
            ? '-translate-x-full'
            : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h2 className="font-title text-xl font-bold tracking-wide uppercase text-black">
              {t('title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-black transition-colors rounded-full hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag className="w-6 h-6 text-zinc-300" />
              </div>
              <p className="text-zinc-500 text-sm">
                {t('empty')}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-3 border border-black text-xs font-semibold tracking-wider uppercase hover:bg-black hover:text-white transition-colors"
              >
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                {/* Image */}
                <div className="w-20 h-24 bg-[#FAF8F5] shrink-0 p-2 overflow-hidden border border-zinc-100">
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={locale === 'ar' ? item.name_ar : item.name_fr}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-black line-clamp-1">
                        {locale === 'ar' ? item.name_ar : item.name_fr}
                      </h3>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        {item.material}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-zinc-200 bg-zinc-50 rounded-none">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1.5 text-zinc-500 hover:text-black transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-zinc-500 hover:text-black transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-black">
                      {(item.price * item.quantity).toFixed(2)} MAD
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-zinc-50 border-t border-zinc-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-medium text-zinc-600">
                {locale === 'ar' ? 'المجموع الإجمالي' : 'Sous-total'}
              </span>
              <span className="text-xl font-bold text-black tracking-tight">
                {getTotalPrice().toFixed(2)} MAD
              </span>
            </div>
            
            <p className="text-[10px] text-zinc-500 text-center mb-4">
              {t('shippingMsg')}
            </p>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full bg-[#C5A059] text-black hover:bg-[#B38D45] flex items-center justify-center gap-2 py-4 text-xs font-extrabold tracking-[0.15em] uppercase transition-colors shadow-sm"
            >
              {t('checkout')}
              <ArrowRight className={`w-4 h-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
