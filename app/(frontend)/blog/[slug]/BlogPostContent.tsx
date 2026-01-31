/**
 * BlogPostContent Component
 *
 * Reusable presentational component for blog post content.
 * Used by both the blog page and the email notification template.
 *
 * Reference: Blog Draft Email - Use Same Component as Blog Page Plan
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PayloadRichText from '@/app/components/PayloadRichText';
import { ZOCDOC_URL } from '@/lib/constants';
import type { BlogPost } from '@/lib/payload-api';

interface BlogPostContentProps {
  post: BlogPost;
  /**
   * When true, renders plain HTML elements instead of Next.js Image/Link.
   * Used for email rendering where Next.js components don't work.
   */
  forEmail?: boolean;
}

/**
 * BlogPostContent renders the main blog post content including:
 * - Featured image
 * - Date + category badge
 * - Title
 * - Excerpt
 * - Article content (with bibliography inside)
 * - Author section
 *
 * Does NOT include: FloatingBookButton, JSON-LD schema, or navigation
 */
export default function BlogPostContent({
  post,
  forEmail = false,
}: BlogPostContentProps) {
  // Format the published date
  const formattedDate = new Date(post.publishedDate).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  // Render image - use plain img for email, Next.js Image for web
  const renderFeaturedImage = () => {
    if (!post.featuredImage) return null;

    if (forEmail) {
      return (
        <div style={{ marginBottom: '32px' }}>
          <img
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '24px',
              backgroundColor: '#f9fafb',
            }}
          />
        </div>
      );
    }

    return (
      <div className="mb-8">
        <Image
          src={post.featuredImage.url}
          alt={post.featuredImage.alt || post.title}
          width={post.featuredImage.width || 1200}
          height={post.featuredImage.height || 675}
          className="w-full h-auto object-contain rounded-3xl bg-gray-50"
          style={{ aspectRatio: '16/9' }}
          priority
        />
      </div>
    );
  };

  // Render author section - use plain anchor for email, Next.js Link for web
  const renderAuthorSection = () => {
    const authorContent = (
      <>
        <div
          className={forEmail ? '' : 'w-28 h-28 rounded-md bg-gray-200 flex items-center overflow-hidden justify-center text-gray-600 text-xl font-[500] flex-shrink-0 relative'}
          style={
            forEmail
              ? {
                  width: '112px',
                  height: '112px',
                  borderRadius: '6px',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                }
              : undefined
          }
        >
          {forEmail ? (
            <img
              src="/Image from Photoroom.png"
              alt="Dr. Joanna Latek"
              style={{
                position: 'absolute',
                width: '96px',
                height: 'auto',
                top: 0,
                objectFit: 'cover',
              }}
            />
          ) : (
            <Image
              src="/Image from Photoroom.png"
              width={1000}
              height={100}
              alt="background"
              className="absolute w-24 h-auto -top-0 object-cover"
            />
          )}
        </div>
        <div>
          {forEmail ? (
            <a
              href={ZOCDOC_URL}
              style={{
                fontWeight: 500,
                color: '#111827',
                fontSize: '20px',
                textDecoration: 'none',
              }}
            >
              {post.author}
            </a>
          ) : (
            <Link
              href={ZOCDOC_URL}
              className="font-[500] text-gray-900 text-xl"
            >
              {post.author}
            </Link>
          )}
          <p
            className={forEmail ? '' : 'text-gray-600 font-[400]'}
            style={forEmail ? { color: '#4b5563', fontWeight: 400 } : undefined}
          >
            Eye Care Specialist at The NYC Optometrist
          </p>
        </div>
      </>
    );

    if (forEmail) {
      return (
        <div
          style={{
            marginTop: '64px',
            overflow: 'hidden',
            borderRadius: '0 0 6px 6px',
          }}
        >
          <div
            style={{
              borderTop: '1px solid #e5e7eb',
              padding: '24px',
              paddingTop: '48px',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {authorContent}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-16 overflow-hidden rounded-b-md">
        <div className="border-t border-gray-200 p-6 pt-12 relative overflow-visible">
          <div className="flex items-center gap-4">{authorContent}</div>
        </div>
      </div>
    );
  };

  // Main container styles
  const containerStyle = forEmail
    ? {
        maxWidth: '768px',
        margin: '0 auto',
        padding: '64px 16px',
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }
    : undefined;

  const containerClass = forEmail
    ? ''
    : 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28 md:pt-40';

  return (
    <div className={containerClass} style={containerStyle}>
      <div className={forEmail ? '' : 'mx-auto'}>
        {/* Featured Image */}
        {renderFeaturedImage()}

        {/* Article Meta */}
        <div
          className={
            forEmail ? '' : 'flex items-center space-x-4 text-sm text-gray-600 mb-6'
          }
          style={
            forEmail
              ? {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '14px',
                  color: '#4b5563',
                  marginBottom: '24px',
                }
              : undefined
          }
        >
          <span>{formattedDate}</span>
          <span
            className={forEmail ? '' : 'bg-gray-200 p-1 px-3 rounded-full'}
            style={
              forEmail
                ? {
                    backgroundColor: '#e5e7eb',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                  }
                : undefined
            }
          >
            Eye Care
          </span>
        </div>

        {/* Title */}
        <h1
          className={
            forEmail
              ? ''
              : 'text-4xl md:text-5xl font-[500] lg:font-bold text-gray-900 mb-6 leading-tight'
          }
          style={
            forEmail
              ? {
                  fontSize: '36px',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '24px',
                  lineHeight: 1.2,
                }
              : undefined
          }
        >
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            className={
              forEmail
                ? ''
                : 'text-xl text-gray-600 font-[400] mb-12 leading-relaxed'
            }
            style={
              forEmail
                ? {
                    fontSize: '20px',
                    color: '#4b5563',
                    fontWeight: 400,
                    marginBottom: '48px',
                    lineHeight: 1.6,
                  }
                : undefined
            }
          >
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        {forEmail ? (
          <div
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              color: '#374151',
            }}
          >
            {/* For email, we render a simplified version of the content */}
            <EmailRichTextContent content={post.content} />
            {/* Bibliography is included in the content for AI-generated posts */}
          </div>
        ) : (
          <article
            className="prose prose-lg max-w-prose
          prose-headings:font-[500] prose-headings:text-gray-900
          prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8
          prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-6
          prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-5
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-4 prose-p:font-[400]
          prose-a:text-gray-900 prose-a:font-[500] prose-a:underline prose-a:underline-offset-4
          prose-strong:text-gray-900 prose-strong:font-[500]
          prose-ul:my-4 prose-ul:list-disc
          prose-ol:my-4 prose-ol:list-decimal
          prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-lg prose-li:mb-1.5 prose-li:font-[400]
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
          prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-gray-900 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:overflow-x-auto
          prose-img:rounded-3xl prose-img:my-6"
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <PayloadRichText content={post.content as unknown as any} />
          </article>
        )}

        {/* Author Section */}
        {renderAuthorSection()}
      </div>
    </div>
  );
}

/**
 * Simplified rich text renderer for email
 * Converts Lexical JSON content to plain HTML for email clients
 */
function EmailRichTextContent({ content }: { content: unknown }) {
  if (!content || typeof content !== 'object') {
    return null;
  }

  const lexicalContent = content as {
    root?: {
      children?: Array<{
        type: string;
        tag?: string;
        text?: string;
        listType?: string;
        children?: Array<{ text?: string; type?: string }>;
      }>;
    };
  };

  if (!lexicalContent.root?.children) {
    return null;
  }

  return (
    <>
      {lexicalContent.root.children.map((node, index) => {
        // Get text content from node
        const getTextContent = (
          children?: Array<{ text?: string; type?: string }>
        ) => {
          if (!children) return '';
          return children.map((child) => child.text || '').join('');
        };

        const textContent = getTextContent(node.children);

        switch (node.type) {
          case 'heading':
            const headingTag = node.tag || 'h2';
            const headingStyle: React.CSSProperties =
              headingTag === 'h1'
                ? {
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#111827',
                    marginTop: '32px',
                    marginBottom: '16px',
                  }
                : headingTag === 'h3'
                ? {
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#111827',
                    marginTop: '20px',
                    marginBottom: '8px',
                  }
                : {
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#111827',
                    marginTop: '24px',
                    marginBottom: '12px',
                  };

            // Render headings explicitly to avoid dynamic element type issues
            if (headingTag === 'h1') {
              return (
                <h1 key={index} style={headingStyle}>
                  {textContent}
                </h1>
              );
            }
            if (headingTag === 'h3') {
              return (
                <h3 key={index} style={headingStyle}>
                  {textContent}
                </h3>
              );
            }
            return (
              <h2 key={index} style={headingStyle}>
                {textContent}
              </h2>
            );

          case 'paragraph':
            return (
              <p
                key={index}
                style={{
                  marginBottom: '16px',
                  lineHeight: 1.7,
                }}
              >
                {textContent}
              </p>
            );

          case 'list':
            const ListTag = node.listType === 'bullet' ? 'ul' : 'ol';
            return (
              <ListTag
                key={index}
                style={{
                  marginTop: '16px',
                  marginBottom: '16px',
                  paddingLeft: '24px',
                }}
              >
                {node.children?.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    style={{
                      marginBottom: '6px',
                      lineHeight: 1.7,
                    }}
                  >
                    {getTextContent(
                      (item as { children?: Array<{ text?: string }> }).children
                    )}
                  </li>
                ))}
              </ListTag>
            );

          default:
            if (textContent) {
              return (
                <p key={index} style={{ marginBottom: '16px' }}>
                  {textContent}
                </p>
              );
            }
            return null;
        }
      })}
    </>
  );
}
