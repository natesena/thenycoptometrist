import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/payload-api";
import { notFound } from "next/navigation";
import FloatingBookButton from '@/app/components/floating button/floating-booking-icon';
import BlogPostContent from './BlogPostContent';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Revalidate every 60 seconds
export const revalidate = 60;

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({
      slug: slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    const imageUrl = post.featuredImage?.url
      || "https://storage.googleapis.com/thenycoptometrist-assets/og.png";

    const description = post.metaDescription || post.excerpt || `${post.title} - The NYC Optometrist Blog`;

    return {
      title: `${post.title} | The NYC Optometrist Blog`,
      description: description,
      openGraph: {
        title: post.title,
        description: description,
        type: "article",
        publishedTime: post.publishedDate,
        authors: [post.author],
        url: `https://www.thenycoptometrist.com/blog/${slug}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Blog Post | The NYC Optometrist",
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.featuredImage?.url || null;

  // JSON-LD Schema for BlogPosting
  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || "",
    datePublished: post.publishedDate,
    dateModified: post.updatedAt || post.publishedDate,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: "Doctor of Optometry",
      worksFor: {
        "@type": "Organization",
        name: "The NYC Optometrist",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "The NYC Optometrist",
      logo: {
        "@type": "ImageObject",
        url: "https://www.thenycoptometrist.com/logo.png",
      },
    },
    url: `https://www.thenycoptometrist.com/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.thenycoptometrist.com/blog/${slug}`,
    },
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
    articleSection: "Eye Care",
    keywords: ["eye care", "optometry", "vision health", "NYC optometrist"],
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />

      {/* Blog post content - uses same component as email template */}
      {/* Reference: Blog Draft Email - Use Same Component as Blog Page Plan */}
      <BlogPostContent post={post} />

      {/* Back Link */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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

      <FloatingBookButton alwaysVisible />
    </div>
  );
}
