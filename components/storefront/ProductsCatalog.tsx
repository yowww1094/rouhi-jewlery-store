'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Heart, SlidersHorizontal, Search, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import Image from 'next/image';

export interface CatalogProduct {
  _id: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  material: string;
  categories: string[];
  targetAudience: 'Men' | 'Women' | 'Unisex';
  isCollection: boolean;
  price: number;
  discountPrice?: number;
  images: string[];
  slug: string;
  isFeatured?: boolean;
}

export interface CatalogCategory {
  _id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  image: string;
}

export default function ProductsCatalog({ 
  initialProducts = [], 
  initialCategories = [],
  initialTab = 'all',
  totalCount = 0
}: { 
  initialProducts?: CatalogProduct[];
  initialCategories?: CatalogCategory[];
  initialTab?: string;
  totalCount?: number;
}) {
  const locale = useLocale();
  const t = useTranslations('Catalog');
  const h = useTranslations('Home');
  const { addItem } = useCartStore();
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const productsList = initialProducts;

  const [selectedTopFilter, setSelectedTopFilter] = useState<'all' | 'collections' | 'men' | 'women' | 'gifts'>(() => {
    if (initialTab === 'collections' || initialTab === 'men' || initialTab === 'women' || initialTab === 'gifts') {
      return initialTab;
    }
    return 'all';
  });

  useEffect(() => {
    if (initialTab === 'collections' || initialTab === 'men' || initialTab === 'women' || initialTab === 'gifts') {
      setSelectedTopFilter(initialTab);
    } else if (!initialTab) {
      setSelectedTopFilter('all');
    }
  }, [initialTab]);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const materials = ['Gold', 'Silver'];

  // Parse filters from URL
  const selectedCategories = searchParams.get('categories')?.split(',') || [];
  const selectedMaterials = searchParams.get('materials')?.split(',') || [];
  const hasDiscount = searchParams.get('discount') === 'true';
  const priceRange: [number, number] = [
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 100000
  ];
  const sortBy = searchParams.get('sort') || 'featured';
  const limit = Number(searchParams.get('limit')) || 6;

  // Generic helper to update URL
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Any filter change resets limit to 6
    if (!updates.hasOwnProperty('limit')) {
      params.delete('limit');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setTopFilter = (val: string) => {
    setSelectedTopFilter(val as any);
    updateUrlParams({ tab: val === 'all' ? null : val });
  };

  const toggleCategory = (cat: string) => {
    let newCats = [...selectedCategories];
    if (newCats.includes(cat)) {
      newCats = newCats.filter(c => c !== cat);
    } else {
      newCats.push(cat);
    }
    updateUrlParams({ categories: newCats.length > 0 ? newCats.join(',') : null });
  };

  const toggleMaterial = (mat: string) => {
    let newMats = [...selectedMaterials];
    if (newMats.includes(mat)) {
      newMats = newMats.filter(m => m !== mat);
    } else {
      newMats.push(mat);
    }
    updateUrlParams({ materials: newMats.length > 0 ? newMats.join(',') : null });
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      updateUrlParams({ q: searchQuery });
    }
  };

  const handlePriceChange = (min: number, max: number) => {
    updateUrlParams({ 
      minPrice: min > 0 ? min.toString() : null, 
      maxPrice: max < 100000 ? max.toString() : null 
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Top Filter Pills Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-8 pt-4">
        {[
          { id: 'all', label_fr: 'Tous', label_ar: 'الكل' },
          { id: 'collections', label_fr: 'Collections', label_ar: 'تشكيلات' },
          { id: 'gifts', label_fr: 'Idées Cadeaux', label_ar: 'أفكار الهدايا' },
          { id: 'women', label_fr: 'Femme', label_ar: 'نسائي' },
          { id: 'men', label_fr: 'Homme', label_ar: 'رجالي' },
        ].map((pill) => (
          <button
            key={pill.id}
            onClick={() => setTopFilter(pill.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all border ${
              selectedTopFilter === pill.id
                ? 'bg-black text-white border-black'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-black hover:text-black'
            }`}
          >
            {locale === 'ar' ? pill.label_ar : pill.label_fr}
          </button>
        ))}
      </div>

      {/* Top Controls Bar: Search & Count & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-y border-zinc-200 mb-8">
        {/* Results Counter */}
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          ({totalCount}) {t('results')}
        </span>

        {/* Search & Sort */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-300 rounded-none text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-[#C5A059] ltr:pl-9 ltr:pr-4 rtl:pr-9 rtl:pl-4"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => updateUrlParams({ sort: e.target.value === 'featured' ? null : e.target.value })}
              className="appearance-none bg-white border border-zinc-300 rounded-none px-4 py-2 pr-8 text-xs font-semibold uppercase text-zinc-700 focus:outline-none focus:border-[#C5A059]"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="low-high">{t('sortLowHigh')}</option>
              <option value="high-low">{t('sortHighLow')}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ltr:right-2.5 rtl:left-2.5 rtl:right-auto" />
          </div>
        </div>
      </div>

      {/* Main Grid + Left Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Mobile Filters Toggle Button */}
        <div className="lg:hidden w-full">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="w-full flex items-center justify-between bg-white border border-zinc-200 px-6 py-4 font-title text-sm font-bold text-black uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
              {t('filters')}
            </div>
            {isMobileFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Left Filter Sidebar */}
        <aside className={`lg:col-span-3 space-y-8 bg-white p-6 border border-zinc-200 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="hidden lg:flex items-center gap-2 pb-4 border-b border-zinc-200">
            <SlidersHorizontal className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-title text-lg font-bold text-black uppercase tracking-wider">
              {t('filters')}
            </h3>
          </div>

          {/* Category Checkboxes */}
          <div className="space-y-3">
            <h4 className="font-title text-sm font-bold text-black uppercase tracking-wider">
              {t('categories')}
            </h4>
            <div className="space-y-2">
              {initialCategories.map((cat) => (
                <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group text-xs text-zinc-700 hover:text-black">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-0 accent-black cursor-pointer"
                  />
                  <span>{locale === 'ar' ? cat.name_ar : cat.name_fr}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-4 border-t border-zinc-200">
            <h4 className="font-title text-sm font-bold text-black uppercase tracking-wider">
              {t('price')}
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={priceRange[0] || ''}
                onChange={(e) => handlePriceChange(Number(e.target.value) || 0, priceRange[1])}
                placeholder="Min"
                className="w-full px-3 py-2 border border-zinc-300 rounded text-xs focus:border-black focus:outline-none"
              />
              <span className="text-zinc-400">-</span>
              <input
                type="number"
                min={0}
                value={priceRange[1] === 100000 ? '' : priceRange[1]}
                onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value) || 100000)}
                placeholder="Max"
                className="w-full px-3 py-2 border border-zinc-300 rounded text-xs focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* Discount Checkbox */}
          <div className="space-y-3 pt-4 border-t border-zinc-200">
            <h4 className="font-title text-sm font-bold text-black uppercase tracking-wider">
              {t('promotions')}
            </h4>
            <label className="flex items-center gap-3 cursor-pointer group text-xs text-zinc-700 hover:text-black">
              <input
                type="checkbox"
                checked={hasDiscount}
                onChange={() => updateUrlParams({ discount: hasDiscount ? null : 'true' })}
                className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-0 accent-black cursor-pointer"
              />
              <span>{t('promotionsOnly')}</span>
            </label>
          </div>

          {/* Material Checkboxes */}
          <div className="space-y-3 pt-4 border-t border-zinc-200">
            <h4 className="font-title text-sm font-bold text-black uppercase tracking-wider">
              {t('material')}
            </h4>
            <div className="space-y-2">
              {materials.map((mat) => (
                <label key={mat} className="flex items-center gap-3 cursor-pointer group text-xs text-zinc-700 hover:text-black">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(mat)}
                    onChange={() => toggleMaterial(mat)}
                    className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-0 accent-black cursor-pointer"
                  />
                  <span>{mat === 'Gold' ? t('gold') : t('silver')}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Products Cards Grid */}
        <main className="lg:col-span-9 space-y-8">
          {productsList.length === 0 ? (
            <div className="text-center py-24 bg-white border border-zinc-200">
              <h3 className="font-title text-xl font-bold text-zinc-800 mb-2">
                {t('noProducts')}
              </h3>
              <p className="text-sm text-zinc-500 max-w-md mx-auto">
                {locale === 'ar' 
                  ? 'لم يتم العثور على مجوهرات تطابق بحثك. يرجى تجربة عوامل تصفية أخرى.' 
                  : 'Aucun bijou ne correspond à votre recherche. Veuillez essayer d\'autres filtres.'}
              </p>
              <button 
                onClick={clearAllFilters}
                className="mt-6 px-6 py-2 border border-black text-xs font-semibold tracking-wider uppercase hover:bg-black hover:text-white transition-colors"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsList.map((product) => {
              const name = locale === 'ar' ? product.name_ar : product.name_fr;
              const isWishlisted = wishlist[product._id];

              return (
                <div
                  key={product._id}
                  className="group relative bg-white border border-zinc-200/80 p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
                >
                  {/* Card Image Container */}
                  <div className="relative aspect-square w-full bg-[#FAF8F5] mb-4 overflow-hidden flex items-center justify-center p-4">
                    <Link href={`/products/${product.slug}`} className="w-full h-full block relative">
                      <Image
                        src={product.images[0]}
                        alt={name}
                        fill
                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
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
          )}

          {/* Load More Button */}
          {limit < totalCount && (
            <div className="text-center pt-8">
              <button
                onClick={() => updateUrlParams({ limit: (limit + 6).toString() })}
                className="px-10 py-3.5 border border-black text-black hover:bg-black hover:text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-none shadow-md"
              >
                {t('loadMore')}
              </button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
