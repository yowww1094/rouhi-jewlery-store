'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';

export interface FeaturedProductProps {
  _id: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  material: string;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
}

export default function FeaturedProductsSection({ products = [] }: { products?: FeaturedProductProps[] }) {
  const t = useTranslations('Home');
  const locale = useLocale();
  const { addItem } = useCartStore();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#FAF8F5] text-black transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-24">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-zinc-200 pb-8">
          <div className="space-y-2">
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-black">
              {t('featuredProductsTitle')}
            </h2>
            <p className="text-zinc-500 max-w-xl text-sm sm:text-base leading-relaxed">
              {t('featuredProductsSubtitle')}
            </p>
          </div>
          <Link
            href="/products"
            className="w-full sm:w-auto shrink-0 px-8 py-4 bg-[#C5A059] text-black font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#b38d45] transition-colors shadow-sm flex items-center justify-center"
          >
            {t('allProducts')}
          </Link>
        </div>

        {products.map((product, idx) => {
          const name = locale === 'ar' ? product.name_ar : product.name_fr;
          const description = locale === 'ar' ? product.description_ar : product.description_fr;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={product._id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
            >
              {/* Image Column (Seamless Background Sync without Card Borders) */}
              <div className={`lg:col-span-6 flex justify-center ${!isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative aspect-square max-w-[440px] w-full group">
                  <Link href={`/products/${product.slug}`} className="w-full h-full block">
                    <img
                      src={product.images[0] || '/images/silver-bracelet.webp'}
                      alt={name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                </div>
              </div>

              {/* Text & Details Column */}
              <div className={`lg:col-span-6 space-y-6 ${!isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-display text-3xl sm:text-6xl font-bold tracking-tight text-[#121214] hover:text-[#C5A059] transition-colors">
                      {name}
                    </h3>
                  </Link>
                </div>

                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-light max-w-lg">
                  {description}
                </p>

                {/* Price & Add to Cart */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => {
                      addItem({
                        id: product._id,
                        productId: product._id,
                        name_fr: product.name_fr,
                        name_ar: product.name_ar,
                        price: product.discountPrice || product.price,
                        image: product.images[0] || '/images/silver-bracelet.webp',
                        material: product.material,
                        quantity: 1,
                      });
                    }}
                    className="w-full sm:w-auto bg-[#1E1E1E] hover:bg-black text-white px-7 py-3.5 rounded-none font-medium text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <span>{t('addToCart')}</span>
                  </button>

                  <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-black">
                      {(product.discountPrice || product.price).toFixed(2)} MAD
                    </span>
                    {product.discountPrice && (
                      <span className="text-sm text-zinc-400 line-through">
                        {product.price.toFixed(2)} MAD
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
