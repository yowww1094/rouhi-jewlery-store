import { setRequestLocale } from 'next-intl/server';
import { connectToDatabase } from '@/lib/db';
import { Order } from '@/models/Order';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CheckCircle2, Package, ArrowLeft } from 'lucide-react';
import Header from '@/components/storefront/Header';

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale, orderId } = await params;
  const t = await getTranslations('Success');
  setRequestLocale(locale);

  let order = null;
  try {
    await connectToDatabase();
    order = await Order.findById(orderId).lean();
  } catch (error) {
    console.error('Error fetching order for success page:', error);
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <Header />
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 pt-20">
          <h1 className="font-display text-3xl font-bold text-black">
            {t('invalidOrder')}
          </h1>
          <Link
            href="/"
            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
          >
            {t('backHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6">
        <style>{`
          @keyframes successScale {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-success {
            animation: successScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>

        <div className="max-w-2xl w-full bg-white p-6 sm:p-10 border border-zinc-200 shadow-sm text-center">
          
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border-8 border-green-100/60 animate-success">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-black mb-4">
            {t('title')}
          </h1>
          <p className="text-sm md:text-base text-zinc-600 max-w-xl mx-auto font-light leading-relaxed">
            {t('subtitle')}
          </p>

          <div className="bg-[#FAF8F5] p-6 sm:p-8 text-left border border-zinc-200 mb-8 space-y-6" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            
            {/* Header info */}
            <div className="space-y-4 pb-6 border-b border-zinc-200">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                  {t('orderNumber')}
                </p>
                <p className="font-mono text-sm md:text-base font-bold text-black">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                  {t('orderDate')}
                </p>
                <span className="text-sm font-medium text-black">
                  {new Date(order.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : 'fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                  {t('paymentMethod')}
                </p>
                <p className="text-sm md:text-base text-black">
                  {t('cod')}
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="md:col-span-3 pt-6 mt-2 border-t border-zinc-200">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                {t('deliveryInfo')}
              </p>
              <div className="bg-white p-4 border border-zinc-200 rounded-sm space-y-1 text-sm text-black">
                <p className="font-bold">{order.customer.fullName}</p>
                <p className="text-zinc-600" dir="ltr">{order.customer.phone}</p>
                <p className="text-zinc-600 mt-2">{order.customer.address}</p>
                <p className="text-zinc-600">{order.customer.city}</p>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white p-6 sm:p-8 border border-zinc-200" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
              <h2 className="font-display text-lg font-bold text-black mb-6">
                {t('itemDetails')}
              </h2>
              <div className="space-y-4">
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm bg-white p-4 border border-zinc-100 shadow-sm rounded-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-black">{locale === 'ar' ? item.name_ar : item.name_fr}</p>
                      <p className="text-zinc-500 text-xs mt-1">
                        {item.quantity} x {item.price.toFixed(2)} MAD
                        {item.material && ` • ${item.material}`}
                      </p>
                    </div>
                    <div className="font-bold text-black whitespace-nowrap self-center">
                      {(item.quantity * item.price).toFixed(2)} MAD
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Total */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
              <span className="font-display text-lg font-bold text-black">
                {t('total')}
              </span>
              <span className="text-2xl font-bold text-[#C5A059]">
                {order.totalAmount.toFixed(2)} MAD
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/products"
              className="px-10 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              <Package className="w-5 h-5" />
              {t('continueShopping')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
