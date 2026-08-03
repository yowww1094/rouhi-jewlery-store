import Header from '@/components/storefront/Header';
import ProductsCatalog from '@/components/storefront/ProductsCatalog';
import NewsletterSection from '@/components/storefront/NewsletterSection';
import Footer from '@/components/storefront/Footer';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getContactInfo } from '@/lib/settings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getProducts(searchParams: any) {
  try {
    await connectToDatabase();
    
    // Build Mongoose Query based on searchParams
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { isActive: true };

    const tab = searchParams.tab;
    if (tab === 'collections') query.isCollection = true;
    if (tab === 'men') query.targetAudience = 'Men';
    if (tab === 'women') query.targetAudience = 'Women';
    if (tab === 'gifts') query.isGift = true;

    const q = searchParams.q;
    if (q) {
      const searchRegex = new RegExp(q, 'i');
      query.$or = [
        { name_fr: searchRegex },
        { name_ar: searchRegex },
        { description_fr: searchRegex },
        { description_ar: searchRegex }
      ];
    }

    if (searchParams.discount === 'true') {
      query.discountPrice = { $gt: 0 };
    }

    if (searchParams.categories) {
      // Find category ObjectIds first
      const catSlugs = searchParams.categories.split(',');
      const categories = await Category.find({ slug: { $in: catSlugs } }, '_id').lean();
      const catIds = categories.map(c => c._id);
      if (catIds.length > 0) {
        query.categories = { $in: catIds };
      }
    }

    if (searchParams.materials) {
      query.material = { $in: searchParams.materials.split(',') };
    }

    if (searchParams.minPrice || searchParams.maxPrice) {
      const min = Number(searchParams.minPrice) || 0;
      const max = Number(searchParams.maxPrice) || 100000;
      
      // We must handle the fact that price logic depends on discountPrice if it exists.
      // A simple approximation is just filtering on `price` since true conditional queries in Mongo are complex.
      // But let's construct a $or for accurate price range.
      query.$or = [
        { discountPrice: { $gte: min, $lte: max } },
        { discountPrice: { $exists: false }, price: { $gte: min, $lte: max } },
        { discountPrice: null, price: { $gte: min, $lte: max } }
      ];
    }

    // Sort Logic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortObj: any = { createdAt: -1 };
    const sort = searchParams.sort;
    if (sort === 'low-high') sortObj = { price: 1 };
    if (sort === 'high-low') sortObj = { price: -1 };
    
    const limit = Number(searchParams.limit) || 6;

    const [products, categories] = await Promise.all([
      Product.find(query).populate('categories').sort(sortObj).limit(limit).lean(),
      Category.find().lean()
    ]);
    
    // Also get the total count for the "Load More" button to know when to hide
    const totalCount = await Product.countDocuments(query);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedProducts = products.map((p: any) => ({
      _id: p._id.toString(),
      name_fr: p.name_fr,
      name_ar: p.name_ar,
      description_fr: p.description_fr,
      description_ar: p.description_ar,
      material: p.material,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: p.categories?.map((c: any) => c.slug) || ['uncategorized'],
      targetAudience: p.targetAudience || 'Unisex',
      isCollection: p.isCollection || false,
      price: p.price,
      discountPrice: p.discountPrice,

      images: p.images || [],
      slug: p.slug,
      isFeatured: p.isFeatured
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedCategories = categories.map((c: any) => ({
      _id: c._id.toString(),
      name_fr: c.name_fr,
      name_ar: c.name_ar,
      slug: c.slug,
      image: c.image || '/images/shop/circle-swatch-1.webp'
    }));

    return { products: formattedProducts, categories: formattedCategories, totalCount };
  } catch (error) {
    console.error('Error fetching catalog data:', error);
    return { products: [], categories: [], totalCount: 0 };
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: Promise<any>;
}) {
  const { locale } = await params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { tab } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations('Catalog');

  const [data, contactInfo] = await Promise.all([
    getProducts(await searchParams),
    getContactInfo()
  ]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121214]">
      {/* 2-Row Site Header */}
      <Header />

      {/* Page Hero Banner - Compact Height & Larger Image */}
      <section className="bg-[#F6F5F4] border-b border-zinc-200 py-4 sm:py-6 lg:py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Title & Description Column */}
            <div className="lg:col-span-5 space-y-2.5">
              <h1 className="font-title text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-[#292D32]">
                {t('title')}
              </h1>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-light max-w-md">
                {t('subtitle')}
              </p>
            </div>

            {/* 2 Silver Diamond Rings Image Column (Larger image display) */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end">
              <div className="w-full max-w-[720px] h-[180px] sm:h-[220px] lg:h-[240px] relative overflow-hidden flex items-center justify-end">
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/shop/shop-header-cover.webp"
                  alt="ROUHI 2 Silver Diamond Rings Header"
                  className="w-full h-full object-contain object-right scale-110 lg:scale-125 origin-right transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog with Swatches, Filter Sidebar, Product Grid */}
      <ProductsCatalog 
        initialProducts={data.products} 
        initialCategories={data.categories} 
        initialTab={(await searchParams).tab || ''} 
        totalCount={data.totalCount}
      />

      {/* Newsletter */}
      <NewsletterSection />

      {/* Footer */}
      <Footer contactInfo={contactInfo} />
    </div>
  );
}
