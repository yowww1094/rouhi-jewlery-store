'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { useCartStore } from '@/lib/store/cart';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createOrder } from '@/actions/order';
import { ArrowLeft, ArrowRight, Lock, Loader2 } from 'lucide-react';
import Header from '@/components/storefront/Header';

// Zod Schema for Client Validation
const CheckoutSchema = z.object({
  fullName: z.string().min(2, { message: 'Name is required' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  address: z.string().min(5, { message: 'Delivery address is required' }),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof CheckoutSchema>;

export default function CheckoutPage() {
  const locale = useLocale();
  const t = useTranslations('Checkout');
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const payload = {
      ...data,
      cartItems: items.map((i) => ({
        productId: i.productId,
        name_fr: i.name_fr,
        name_ar: i.name_ar,
        quantity: i.quantity,
        material: i.material,
        price: i.price,
      })),
    };

    const result = await createOrder(payload);

    if (result.success && result.orderId) {
      clearCart();
      router.push(`/checkout/success/${result.orderId}`);
    } else {
      setErrorMsg(result.error || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <h1 className="font-display text-3xl font-bold text-black">
            {t('emptyCart')}
          </h1>
          <Link
            href="/products"
            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            {t('backToShop')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Simple Header for Checkout (no nav, less distraction) */}
      <header className="bg-white border-b border-zinc-200 h-20 flex items-center justify-center relative">
        <Link
          href="/cart"
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
          className="absolute left-6 text-zinc-500 hover:text-black transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${locale === 'ar' ? 'rotate-180' : ''}`} />
        </Link>
        <Link href="/" className="font-display text-3xl font-extrabold tracking-[0.15em] text-black uppercase">
          ROUHI
        </Link>
        <div className="absolute right-6 flex items-center gap-1.5 text-zinc-400 text-xs font-medium uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Secure</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-10">
            {/* Continue Shopping Banner */}
            <div className="bg-[#FAF8F5] border border-[#C5A059]/30 p-4 flex items-center justify-between shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-black">
                  {t('addMoreTitle')}
                </span>
                <span className="text-xs text-zinc-600 mt-1">
                  {t('addMoreDesc')}
                </span>
              </div>
              <Link 
                href="/products" 
                className="shrink-0 bg-black text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
              >
                {t('continue')}
              </Link>
            </div>

            <div>
              <h1 className="font-display text-3xl font-bold text-black mb-2">
                {t('deliveryDetails')}
              </h1>
              <p className="text-zinc-500 text-sm">
                {t('deliveryDesc')}
              </p>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {errorMsg && (
                <div className="p-4 bg-red-50 text-red-600 text-sm border border-red-100">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-black uppercase mb-1.5">
                    {t('fullName')}
                  </label>
                  <input
                    {...register('fullName')}
                    className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                    placeholder={t('fullNamePlaceholder')}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-black uppercase mb-1.5">
                    {t('phone')}
                  </label>
                  <input
                    {...register('phone')}
                    dir="ltr"
                    className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                    placeholder={t('phonePlaceholder')}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-black uppercase mb-1.5">
                    {t('city')}
                  </label>
                  <input
                    {...register('city')}
                    className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                    placeholder={t('city')}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-black uppercase mb-1.5">
                    {t('address')}
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors resize-none"
                    placeholder={t('addressPlaceholder')}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold tracking-wider text-zinc-500 uppercase mb-1.5">
                    {t('notes')}
                  </label>
                  <input
                    {...register('notes')}
                    className="w-full bg-white border border-zinc-200 px-4 py-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                    placeholder={locale === 'ar' ? 'معلومات إضافية للمندوب...' : 'Informations supplémentaires...'}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-zinc-200 p-6 sm:p-8 lg:sticky lg:top-8">
              <h2 className="font-display text-xl font-bold text-black mb-6 pb-4 border-b border-zinc-200">
                {t('orderSummary')}
              </h2>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-20 bg-[#FAF8F5] p-1 border border-zinc-100 shrink-0">
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="product" className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-semibold text-black line-clamp-1">
                          {locale === 'ar' ? item.name_ar : item.name_fr}
                        </h3>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {item.material}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] text-zinc-500">
                          {t('qty')} {item.quantity}
                        </span>
                        <span className="text-xs font-bold text-black">
                          {(item.price * item.quantity).toFixed(2)} MAD
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-200 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>{t('subtotal')}</span>
                  <span>{getTotalPrice().toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600">
                  <span>{t('shipping')}</span>
                  <span className="text-green-600 font-medium">
                    {t('free')}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-black pt-4 border-t border-zinc-200">
                  <span>{t('total')}</span>
                  <span>{getTotalPrice().toFixed(2)} MAD</span>
                </div>
              </div>

              <div className="bg-zinc-50 p-4 border border-zinc-200 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-zinc-200">
                  <span className="text-lg">🚚</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                    {t('placeOrder')}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {t('codDesc')}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full lg:w-full fixed lg:static bottom-0 left-0 right-0 z-50 bg-[#C5A059] text-black hover:bg-[#B38D45] disabled:bg-zinc-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-4 lg:py-4 pb-[env(safe-area-inset-bottom,1rem)] lg:pb-4 text-xs font-extrabold tracking-[0.15em] uppercase transition-colors shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t('confirmOrder')}
                    <ArrowRight className={`w-4 h-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Spacer block on mobile to prevent content from hiding behind the sticky button */}
          <div className="h-16 lg:hidden block" />
        </div>
      </main>
    </div>
  );
}
