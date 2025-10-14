import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { getBlogPostBySlug, getAllBlogSlugs, STRAPI_URL } from '@/lib/strapi';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({
      slug: slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    const imageUrl = post.featuredImage && post.featuredImage.length > 0
      ? `${STRAPI_URL}${post.featuredImage[0].url}`
      : 'https://storage.googleapis.com/thenycoptometrist-assets/og.png';

    const description = (post.Excerpt || post.excerpt || post.content.substring(0, 160)) as string;

    return {
      title: `${post.title} | The NYC Optometrist Blog`,
      description: description,
      openGraph: {
        title: post.title,
        description: description,
        type: 'article',
        publishedTime: post.publishedDate,
        authors: [post.author],
        url: `https://www.thenycoptometrist.com/blog/${slug}`,
        images: [{
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title
        }]
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('Failed to generate metadata:', error);
    return {
      title: 'Blog Post | The NYC Optometrist',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.featuredImage && post.featuredImage.length > 0
    ? `${STRAPI_URL}${post.featuredImage[0].url}`
    : null;

  // JSON-LD Schema for BlogPosting
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.Excerpt || post.excerpt || '',
    'datePublished': post.publishedDate,
    'dateModified': post.updatedAt || post.publishedDate,
    'author': {
      '@type': 'Person',
      'name': post.author,
      'jobTitle': 'Doctor of Optometry',
      'worksFor': {
        '@type': 'Organization',
        'name': 'The NYC Optometrist'
      }
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'The NYC Optometrist',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.thenycoptometrist.com/logo.png'
      }
    },
    'url': `https://www.thenycoptometrist.com/blog/${slug}`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://www.thenycoptometrist.com/blog/${slug}`
    },
    ...(imageUrl && {
      'image': {
        '@type': 'ImageObject',
        'url': imageUrl,
        'width': 1200,
        'height': 630
      }
    }),
    'articleSection': 'Eye Care',
    'keywords': ['eye care', 'optometry', 'vision health', 'NYC optometrist']
  };

  return (
    <div className='bg-white'>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 md:pt-40">
      <div className="max-w- mx-auto">
        {/* Featured Image */}
        {post.featuredImage && post.featuredImage.length > 0 && (
          <div className="mb-8">
            <img
              src={`${STRAPI_URL}${post.featuredImage[0].url}`}
              alt={post.featuredImage[0].alternativeText || post.title}
              className="w-full h-auto object-cover rounded-3xl"
              style={{ aspectRatio: '16/9' }}
            />
          </div>
        )}

        {/* Article Meta */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
          <span>
            {new Date(post.publishedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <span className='bg-gray-200 p-1 px-3 rounded-full'>Eye Care</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-[500] lg:font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {(post.Excerpt || post.excerpt) && (
          <p className="text-xl text-gray-600 font-[400] mb-12 leading-relaxed">
            {post.Excerpt || post.excerpt}
          </p>
        )}

        {/* Content */}
        <article className="prose prose-lg max-w-none
          prose-headings:font-[500] prose-headings:text-gray-900
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
          prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10
          prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-p:font-[400]
          prose-a:text-gray-900 prose-a:font-[500] prose-a:underline prose-a:underline-offset-4
          prose-strong:text-gray-900 prose-strong:font-[500]
          prose-ul:my-6 prose-ul:list-disc
          prose-ol:my-6 prose-ol:list-decimal
          prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-lg prose-li:mb-2 prose-li:font-[400]
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
          prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-gray-900 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:overflow-x-auto
          prose-img:rounded-3xl prose-img:my-8"
        >
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Author Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl font-[500] flex-shrink-0">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-[500] text-gray-900 text-lg">{post.author}</p>
              <p className="text-gray-600 font-[400]">Eye Care Specialist at The NYC Optometrist</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-[400]">Back to all posts</span>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
