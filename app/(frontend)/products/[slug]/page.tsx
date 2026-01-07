import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { getProductBySlug, getAllProductSlugs } from '@/lib/products';
import { trackProductReferralClick } from '@/lib/analytics';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const imageUrl = product.images?.[0]?.url || 'https://storage.googleapis.com/thenycoptometrist-assets/og.png';
  const description = product.description.substring(0, 160);

  return {
    title: `${product.name} | The NYC Optometrist`,
    description: description,
    openGraph: {
      title: product.name,
      description: description,
      type: 'website',
      url: `https://www.thenycoptometrist.com/products/${slug}`,
      images: [
        {
          url: imageUrl,
          width: product.images?.[0]?.width || 1200,
          height: product.images?.[0]?.height || 630,
          alt: product.images?.[0]?.alt || product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageUrl = product.images?.[0]?.url || null;
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description.substring(0, 160),
    image: imageUrl,
    url: `https://www.thenycoptometrist.com/products/${slug}`,
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: product.referralUrl,
    },
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 md:pt-40">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-[400]">Back to all products</span>
            </Link>
          </div>

          {imageUrl && (
            <div className="mb-8">
              <Image
                src={imageUrl}
                alt={product.images?.[0]?.alt || product.name}
                width={product.images?.[0]?.width || 1200}
                height={product.images?.[0]?.height || 675}
                className="w-full h-auto object-contain rounded-3xl bg-gray-50"
                style={{ aspectRatio: '16/9' }}
                priority
              />
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-[500] lg:font-bold text-gray-900 mb-6 leading-tight">
            {product.name}
          </h1>

          <article className="prose prose-lg max-w-none
            prose-headings:font-[500] prose-headings:text-gray-900
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-p:font-[400]
            prose-a:text-gray-900 prose-a:font-[500] prose-a:underline prose-a:underline-offset-4
            prose-strong:text-gray-900 prose-strong:font-[500]">
            <p>{product.description}</p>
          </article>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Affiliate Disclosure:</span> This page contains affiliate links. If you purchase through these links, I may earn a commission at no extra cost to you.
            </p>
          </div>

          <div className="mt-8">
            <a
              href={product.referralUrl}
              rel="noopener noreferrer"
              target="_blank"
              onClick={() => trackProductReferralClick({
                product: product.name,
                categoryId: product.categoryId,
                location: 'product-page-cta',
                page: `/products/${slug}`,
                url: product.referralUrl,
              })}
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-[500] text-lg rounded-lg hover:bg-gray-800 transition-colors"
            >
              View on Amazon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
