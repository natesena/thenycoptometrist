import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getBlogPosts, type BlogPost } from '@/lib/payload-api';
import FloatingBookButton from '@/app/components/floating button/floating-booking-icon';

export const metadata: Metadata = {
  title: 'Eye Care Blog | Expert Tips & Insights - The NYC Optometrist',
  description: 'Your trusted resource for comprehensive eye care, vision health, and expert optometry insights from Dr. Joanna Latek.',
  openGraph: {
    title: 'Eye Care Blog | The NYC Optometrist',
    description: 'Your trusted resource for comprehensive eye care, vision health, and expert optometry insights from Dr. Joanna Latek.',
    type: 'website',
    url: 'https://www.thenycoptometrist.com/blog',
    images: [{
      url: 'https://storage.googleapis.com/thenycoptometrist-assets/og.png',
      width: 1200,
      height: 630,
      alt: 'The NYC Optometrist Blog'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eye Care Blog | The NYC Optometrist',
    description: 'Your trusted resource for comprehensive eye care, vision health, and expert optometry insights.',
    images: ['https://storage.googleapis.com/thenycoptometrist-assets/og.png'],
  },
};

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    const response = await getBlogPosts({ status: 'published' });
    posts = response.docs;
  } catch (error) {
    console.error('Failed to load posts:', error);
  }

  // JSON-LD Schema for Blog
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'The NYC Optometrist Blog',
    'description': 'Your trusted resource for comprehensive eye care, vision health, and expert optometry insights.',
    'url': 'https://www.thenycoptometrist.com/blog',
    'publisher': {
      '@type': 'Organization',
      'name': 'The NYC Optometrist',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.thenycoptometrist.com/logo.png'
      }
    },
    'blogPost': posts.map(post => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.excerpt || '',
      'datePublished': post.publishedDate,
      'author': {
        '@type': 'Person',
        'name': post.author
      },
      'url': `https://www.thenycoptometrist.com/blog/${post.slug}`,
      ...(post.featuredImage && {
        'image': post.featuredImage.url
      })
    }))
  };

  return (
    <div className='bg-white min-h-[80vh]'>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 md:pt-40">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-[500] lg:font-bold text-gray-900 max-w-4xl mx-auto">
            Your trusted resource for comprehensive eye care, vision health, and expert optometry insights.
          </h1>
        </div>

        {/* Articles Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="flex flex-col">
                {/* Article Image */}
                <div className="mb-6 rounded-lg overflow-hidden">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt || post.title}
                      width={post.featuredImage.width || 800}
                      height={post.featuredImage.height || 450}
                      className="w-full h-auto object-contain rounded-3xl min-h-[17.5rem] md:h-[25rem] bg-gray-50"
                      style={{ aspectRatio: '16/9' }}
                    />
                  ) : (
                    <div className="w-full rounded-3xl min-h-[17.5rem] md:h-[25rem] bg-gray-100 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gray-300">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Meta */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>
                    {new Date(post.publishedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className='bg-gray-200 p-1 px-3 rounded-full'>Eye Care</span>
                </div>

                {/* Article Title */}
                <h2 className="text-xl md:text-2xl font-[400] md:font-[500] text-gray-900 mb-2">
                  {post.title}
                </h2>

                {/* Article Description */}
                {post.excerpt && (
                  <p className="text-md text-gray-600 font-[400]">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
      <FloatingBookButton />
    </div>
  );
}
