import Header from '@/components/storefront/Header';
import HeroBanner from '@/components/storefront/HeroBanner';
import MarqueeTicker from '@/components/storefront/MarqueeTicker';
import OurStorySection from '@/components/storefront/OurStorySection';
import FeaturedProductsSection from '@/components/storefront/FeaturedProductsSection';
import BestCollectionsBanner from '@/components/storefront/BestCollectionsBanner';
import GoldFeatureSection from '@/components/storefront/GoldFeatureSection';
import GiftGuideSection from '@/components/storefront/GiftGuideSection';
import NewsletterSection from '@/components/storefront/NewsletterSection';
import Footer from '@/components/storefront/Footer';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import { getContactInfo } from '@/lib/settings';

export const revalidate = 300; // 5-minute page cache revalidation for lightning fast loads

async function getFeaturedProducts() {
  try {
    // 500ms race timeout to ensure instantaneous page rendering even if DB connection is offline
    const fetchPromise = (async () => {
      await connectToDatabase();
      const products = await Product.find({ isFeatured: true, isActive: true })
        .limit(6)
        .lean()
        .exec();
      return JSON.parse(JSON.stringify(products));
    })();

    const timeoutPromise = new Promise<unknown[]>((resolve) => setTimeout(() => resolve([]), 500));

    return await Promise.race([fetchPromise, timeoutPromise]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
}

async function getGiftProducts() {
  try {
    const fetchPromise = (async () => {
      await connectToDatabase();
      const products = await Product.find({ isGift: true, isActive: true })
        .limit(6)
        .lean()
        .exec();
      return JSON.parse(JSON.stringify(products));
    })();

    const timeoutPromise = new Promise<unknown[]>((resolve) => setTimeout(() => resolve([]), 500));
    return await Promise.race([fetchPromise, timeoutPromise]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, giftProducts, contactInfo] = await Promise.all([
    getFeaturedProducts(),
    getGiftProducts(),
    getContactInfo()
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-black">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <MarqueeTicker />
        <OurStorySection />
        <FeaturedProductsSection products={featuredProducts} />
        <BestCollectionsBanner />
        <GoldFeatureSection />
        <GiftGuideSection products={giftProducts} />
        <NewsletterSection />
      </main>
      <Footer contactInfo={contactInfo} />
    </div>
  );
}
