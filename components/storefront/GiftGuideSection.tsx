'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';

export interface GiftProductProps {
  _id: string;
  name_fr: string;
  name_ar: string;
  material: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
}

export default function GiftGuideSection({ products = [] }: { products?: GiftProductProps[] }) {
  const locale = useLocale();
  const t = useTranslations('Sections');
  const h = useTranslations('Home');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const { addItem } = useCartStore();

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="gift-guide" className="py-20 bg-white text-black transition-colors overflow-hidden">
      
      {/* PART 1: Full-Screen Width Banner with Title & Subtitle in Bottom Left */}
      <div className="relative w-full min-h-[500px] lg:min-h-[560px] flex items-end p-8 sm:p-16 text-white bg-black mb-20">
        {/* Full Screen Cover Image */}
        <img
          src="/images/gift-guide-hero.webp"
          alt="Gift Guide Rouhi"
          className="absolute inset-0 w-full h-full object-cover opacity-75 rounded-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Title & Subtitle Positioned in Bottom Left */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-3 pb-4">
          <h2 className="font-display text-5xl sm:text-7xl font-extrabold tracking-tight text-white/95">
            {t('giftGuide')}
          </h2>
          <p className="font-display text-lg sm:text-2xl text-zinc-200 tracking-wide font-light max-w-xl">
            {t('editorialTitle')}
          </p>
        </div>
      </div>

      {/* PART 2: Gift Products Grid */}
      {products.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const name = locale === 'ar' ? product.name_ar : product.name_fr;
              const isWishlisted = wishlist[product._id];

              return (
                <div
                  key={product._id}
                  className="group relative bg-white border border-zinc-200/80 p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Image Container */}
                  <div className="relative aspect-square w-full bg-[#FAF8F5] mb-4 overflow-hidden flex items-center justify-center p-4">
                    <Link href={`/products/${product.slug}`} className="w-full h-full">
                      <img
                        src={product.images[0] || '/images/silver-bracelet.webp'}
                        alt={name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>

                    {/* Wishlist Heart Button Top Right */}
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      aria-label="Wishlist"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-zinc-600 hover:text-red-500 shadow-md transition-colors z-10"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-2">
                    {/* Material Swatch Dots */}
                    <div className="flex items-center gap-1.5">
                      {product.material === 'Silver' && <span className="w-2.5 h-2.5 rounded-full bg-zinc-400 border border-zinc-300" title="Argent" />}
                      {product.material === 'Gold' && <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" title="Or" />}
                    </div>

                    {/* Title */}
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-sans font-medium text-xs text-zinc-900 line-clamp-2 leading-snug hover:text-[#C5A059] transition-colors">
                        {name}
                      </h3>
                    </Link>

                    {/* Price Display */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-black font-bold">
                        {(product.discountPrice || product.price).toFixed(2)} MAD
                      </span>
                      {product.discountPrice && (
                        <span className="text-[11px] text-zinc-400 line-through">
                          {product.price.toFixed(2)} MAD
                        </span>
                      )}
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        addItem({
                          id: product._id,
                          productId: product._id,
                          name_fr: product.name_fr,
                          name_ar: product.name_ar,
                          price: product.discountPrice || product.price,
                          image: product.images[0] || '/images/silver-bracelet.webp',
                          quantity: 1
                        });
                      }}
                      className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-black text-white hover:bg-[#C5A059] transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{h('addToCart')}</span> 
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/products?tab=gifts"
              className="inline-flex items-center justify-center px-10 py-3.5 border border-black text-black hover:bg-black hover:text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-sm"
            >
              {t('exploreCatalog')}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
