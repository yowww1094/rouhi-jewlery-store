'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CatalogProduct } from '@/components/storefront/ProductsCatalog';
import { Link, useRouter } from '@/i18n/routing';
import { Star, Heart, Plus, Minus, ChevronDown, ChevronUp, Gift, Zap, X } from 'lucide-react';
import FeaturedProductsSection from './FeaturedProductsSection';
import { useCartStore } from '@/lib/store/cart';
import Image from 'next/image';

export default function ProductDetailsView({ product, similarProducts = [] }: { product: CatalogProduct, similarProducts?: any[] }) {
  const locale = useLocale();
  const t = useTranslations('ProductDetails');
  const name = locale === 'ar' ? product.name_ar : product.name_fr;
  const description = locale === 'ar' ? product.description_ar : product.description_fr;
  const isRtl = locale === 'ar';

  const [openAccordion, setOpenAccordion] = useState<string | null>('detail');
  const [quantity, setQuantity] = useState(1);
  const images = product.images || [];
  const [selectedImage, setSelectedImage] = useState(images[0] || '');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const handleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const { addItem } = useCartStore();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      productId: product._id,
      name_fr: product.name_fr,
      name_ar: product.name_ar,
      price: product.discountPrice || product.price,
      image: images[0],
      material: product.material,
      quantity,
    });
    // Optional: trigger cart drawer open here by firing an event or just let user click the icon
  };

  const handleBuyImmediately = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <main className="max-w-[1280px] mx-auto pt-6 pb-24 px-4 sm:px-8 lg:px-16">
      {/* Breadcrumbs */}
      <div className="py-4 mb-4">
        <nav className="text-xs text-zinc-500 font-sans tracking-wide">
          <Link href="/" className="hover:text-black">HOME</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-black uppercase">SHOP</Link>
          <span className="mx-2">/</span>
          <span className="text-black uppercase">{name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-6 flex gap-4">
          <div className="flex-1 flex flex-col gap-4">
            {/* Main Image */}
            <div 
              className="relative aspect-square w-full bg-[#F6F5F4] overflow-hidden cursor-zoom-in group rounded-md"
              onClick={() => setIsZoomModalOpen(true)}
            >
              <Image 
                src={selectedImage} 
                alt={`${name} main view`} 
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-[#F6F5F4] overflow-hidden rounded-md transition-colors ${selectedImage === img ? 'ring-2 ring-black' : 'ring-1 ring-transparent hover:ring-zinc-300'}`}
                  >
                    <Image 
                      src={img}
                      alt={`${name} thumbnail ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Icons column for Image Gallery */}
          <div className="w-12 flex flex-col gap-4 shrink-0 items-center pt-4">
            <button className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>
            <button className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-md flex items-center justify-center mb-8">
              <Heart className="w-[18px] h-[18px]" />
            </button>
            
            <button 
              className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-md flex items-center justify-center"
              onClick={() => {
                const currentIndex = images.indexOf(selectedImage);
                const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
                setSelectedImage(images[prevIndex]);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button 
              className="w-10 h-10 bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-md flex items-center justify-center"
              onClick={() => {
                const currentIndex = images.indexOf(selectedImage);
                const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
                setSelectedImage(images[nextIndex]);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Product Info */}
        <div className="lg:col-span-5 xl:col-span-5 lg:col-start-7 xl:col-start-7 lg:sticky lg:top-40 self-start space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <p className="text-zinc-500 text-sm font-sans tracking-wide">Maison Rouhi</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-black tracking-tight leading-snug">
              {name}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="font-display text-2xl font-bold text-black">
                {(product.discountPrice || product.price).toFixed(2)} MAD
              </span>
              {product.discountPrice && (
                <span className="text-sm text-zinc-400 line-through">
                  {product.price.toFixed(2)} MAD
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-dashed border-zinc-200 my-6"></div>

          {/* Description - Directly Visible */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-black uppercase tracking-wider">{t('detailTab')}:</h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-serif whitespace-pre-wrap">
              {description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-4">
            <div className="flex gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-zinc-300 h-12 w-28 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 h-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 h-full flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white hover:bg-zinc-800 transition-colors h-12 text-xs font-bold tracking-widest uppercase flex items-center justify-center shadow-lg shadow-black/10"
              >
                {t('addToCart')}
              </button>
            </div>
            
            {/* Buy Immediately */}
            <button
              onClick={handleBuyImmediately}
              className="w-full bg-[#C5A059] text-black hover:bg-[#B38D45] transition-colors h-12 text-xs font-bold tracking-widest uppercase flex items-center justify-center shadow-lg shadow-black/5 gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              {t('buyNow')}
            </button>
          </div>

          {/* Delivery T&C Link */}
          <div className="pt-4">
            <a href="#" className="text-xs text-zinc-500 underline hover:text-black transition-colors">
              Delivery T&C
            </a>
          </div>

          {/* Smart Gift Card */}
          <div className="bg-[#FAF8F5] p-6 flex items-start gap-4 border border-zinc-200/50 mt-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-zinc-200">
              <Gift className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-black uppercase tracking-wider">
                {t('sendGift')}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {locale === 'ar'
                  ? 'أضف رسالة مخصصة وتغليف فاخر عند الدفع لتجربة إهداء لا تُنسى.'
                  : 'Add a personalized message and luxury packaging at checkout for an unforgettable gifting experience.'}
              </p>
            </div>
          </div>

          {/* Accordion Info Sections (Reduced) */}
          <div className="border-t border-zinc-200 mt-8">
            {[
              { id: 'shipping', label: t('shippingTab'), content: t('shippingDesc') },
              { id: 'compatibility', label: t('compatibilityTab'), content: t('compatibilityDesc') },
            ].map((section) => (
              <div key={section.id} className="border-b border-zinc-200">
                <button
                  onClick={() => handleAccordion(section.id)}
                  className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${openAccordion === section.id ? 'text-black' : 'text-zinc-600 group-hover:text-black'}`}>
                    {section.label}
                  </span>
                  {openAccordion === section.id ? (
                    <ChevronUp className="w-4 h-4 text-black" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-black" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === section.id ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm text-zinc-600 leading-relaxed font-serif">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-32">
          <div className="px-4 sm:px-6 lg:px-12 text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-black">
              {t('similarProducts')}
            </h2>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => {
                const similarName = locale === 'ar' ? p.name_ar : p.name_fr;
                return (
                  <div key={p._id} className="group cursor-pointer">
                    <div className="aspect-[4/5] bg-[#F6F5F4] overflow-hidden mb-4 relative">
                      {p.images?.[0] && (
                        <Image
                          src={p.images[0]}
                          alt={similarName}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 p-4"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <Link href={`/products/${p.slug}`} className="w-full">
                          <button className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                            {t('view')}
                          </button>
                        </Link>
                      </div>
                    </div>
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="font-sans text-sm font-medium text-black group-hover:text-[#C5A059] transition-colors line-clamp-1">
                        {similarName}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-zinc-900 text-xs font-bold">{(p.discountPrice || p.price).toFixed(2)} MAD</p>
                      {p.discountPrice && (
                        <p className="text-zinc-400 text-[10px] line-through">{p.price.toFixed(2)} MAD</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
