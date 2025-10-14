import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPosts, STRAPI_URL } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Eye Care Blog | Expert Tips & Insights - The NYC Optometrist',
  description: 'Expert eye care insights and tips for healthier vision from Dr. Joanna Latek. Learn about eye health, vision care, and optometry best practices.',
  openGraph: {
    title: 'Eye Care Blog | The NYC Optometrist',
    description: 'Expert eye care insights and tips for healthier vision from Dr. Joanna Latek.',
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
    description: 'Expert eye care insights and tips for healthier vision.',
    images: ['https://storage.googleapis.com/thenycoptometrist-assets/og.png'],
  },
};

interface BlogPost {
  id: number;
  title: string;
  Slug?: string;
  slug?: string;
  Excerpt?: string;
  excerpt?: string;
  content: string;
  publishedDate: string;
  author: string;
  featuredImage?: any[];
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  
  try {
    const response = await getBlogPosts();
    posts = response.data;
  } catch (error) {
    console.error('Failed to load posts:', error);
  }

  // JSON-LD Schema for Blog
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'The NYC Optometrist Blog',
    'description': 'Expert eye care insights and tips for healthier vision.',
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
      'description': (post as any).Excerpt || post.excerpt || '',
      'datePublished': post.publishedDate,
      'author': {
        '@type': 'Person',
        'name': post.author
      },
      'url': `https://www.thenycoptometrist.com/blog/${(post as any).Slug || post.slug}`,
      ...(post.featuredImage && post.featuredImage.length > 0 && {
        'image': `${STRAPI_URL}${post.featuredImage[0].url}`
      })
    }))
  };

  return (
<div className='bg-white'>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 md:pt-40">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-[500] lg:font-bold text-gray-900 max-w-4xl mx-auto">
          Expert eye care insights and tips for healthier vision.
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
            <Link key={post.id} href={`/blog/${(post as any).Slug || post.slug}`} className="flex flex-col">
              {/* Article Image */}
              <div className="mb-6 rounded-lg overflow-hidden">
                {post.featuredImage && post.featuredImage.length > 0 ? (
                  <img
                    src={`${STRAPI_URL}${post.featuredImage[0].url}`}
                    alt={post.featuredImage[0].alternativeText || post.title}
                    className="w-full h-auto object-cover rounded-3xl min-h-[17.5rem] md:h-[25rem]"
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
              {((post as any).Excerpt || post.excerpt) && (
                <p className="text-md text-gray-600 font-[400]">
                  {(post as any).Excerpt || post.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
</div>
  );
}
