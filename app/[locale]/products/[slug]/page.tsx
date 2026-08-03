import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { connectToDatabase } from '@/lib/db';
import { Product } from '@/models/Product';
import ProductDetailsView from '@/components/storefront/ProductDetailsView';
import { Metadata } from 'next';
import { CatalogProduct } from '@/components/storefront/ProductsCatalog';
import Header from '@/components/storefront/Header';
import NewsletterSection from '@/components/storefront/NewsletterSection';
import Footer from '@/components/storefront/Footer';
import { getContactInfo } from '@/lib/settings';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  
  let productInfo = null;
  
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug, isActive: true }).lean();
    if (product) {
      productInfo = product;
    }
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
  }



  if (!productInfo) {
    return { title: 'Produit Introuvable | ROUHI' };
  }

  const name = locale === 'ar' ? productInfo.name_ar : productInfo.name_fr;
  const description = locale === 'ar' ? productInfo.description_ar : productInfo.description_fr;

  return {
    title: `${name} | ROUHI Jewelry`,
    description: description,
    openGraph: {
      images: productInfo.images && productInfo.images.length > 0 ? [productInfo.images[0]] : [],
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;

  let product: any = null;
  let contactInfo = null;

  try {
    await connectToDatabase();
    const [dbProduct, fetchedContactInfo] = await Promise.all([
      Product.findOne({ slug, isActive: true }).lean(),
      getContactInfo()
    ]);
    contactInfo = fetchedContactInfo;
    let similarDbProducts: any[] = [];
    if (dbProduct) {
      const categoryConditions = [];
      if (dbProduct.categories && dbProduct.categories.length > 0) {
        categoryConditions.push({ categories: { $in: dbProduct.categories } });
      }
      // Support legacy 'category' string field
      if ((dbProduct as any).category) {
        categoryConditions.push({ category: (dbProduct as any).category });
      }

      if (categoryConditions.length > 0) {
        similarDbProducts = await Product.find({
          _id: { $ne: dbProduct._id },
          isActive: true,
          $or: categoryConditions
        }).limit(4).lean();
      }

      const similarProducts = similarDbProducts.map(p => ({
        _id: p._id.toString(),
        name_fr: p.name_fr,
        name_ar: p.name_ar,
        price: p.price,
        discountPrice: p.discountPrice,
        images: p.images || [],
        slug: p.slug
      }));

      product = {
        _id: dbProduct._id.toString(),
        name_fr: dbProduct.name_fr,
        name_ar: dbProduct.name_ar,
        description_fr: dbProduct.description_fr,
        description_ar: dbProduct.description_ar,
        material: dbProduct.material,
        categories: dbProduct.categories?.map((c: any) => c.toString()) || ['Uncategorized'],
        targetAudience: dbProduct.targetAudience || 'Unisex',
        isCollection: dbProduct.isCollection || false,
        price: dbProduct.price,
        discountPrice: dbProduct.discountPrice,

        images: dbProduct.images || [],
        slug: dbProduct.slug,
        similarProducts,
      };
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
  }



  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121214] flex flex-col">
      <Header />
      <div className="flex-1 bg-white">
        <ProductDetailsView product={product} similarProducts={product.similarProducts || []} />
      </div>
      <NewsletterSection />
      <Footer contactInfo={contactInfo} />
    </div>
  );
}
