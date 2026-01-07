import { getProducts } from '@/lib/products';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recommended Products | The NYC Optometrist',
  description: 'Discover recommended eye care products from Dr. Joanna Latek.',
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getProducts({ available: true });
  
  const productsSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Recommended Products',
    description: 'Discover recommended eye care products from Dr. Joanna Latek.',
    url: 'https://www.thenycoptometrist.com/products',
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description.substring(0, 160),
        url: `https://www.thenycoptometrist.com/products/${product.slug}`,
        image: product.images?.[0]?.url,
      },
    })),
  };
  
  return (
    <div className="bg-white min-h-[80vh]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 md:pt-40">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-[500] lg:font-bold text-gray-900 max-w-4xl mx-auto">
            Recommended Products
          </h1>
          <p className="text-xl text-gray-600 font-[400] mt-4">
            Discover quality eye care products trusted by our patients
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-12">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Affiliate Disclosure:</span> We earn a commission from qualifying purchases made through links below at no extra cost to you.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="flex flex-col"
              >
                <div className="mb-6 rounded-lg overflow-hidden">
                  {product.images?.[0] ? (
                    <div className="w-full h-auto object-contain rounded-3xl min-h-[17.5rem] md:h-[25rem] bg-gray-50">
                      {product.images[0].url && (
                        <img 
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          className="w-full h-full object-contain"
                          style={{ aspectRatio: '4/3' }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full rounded-3xl min-h-[17.5rem] md:h-[25rem] bg-gray-100 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gray-300">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-[400] md:font-[500] text-gray-900 mb-2">
                  {product.name}
                </h2>

                <p className="text-md text-gray-600 font-[400] line-clamp-3">
                  {product.description.substring(0, 200)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
