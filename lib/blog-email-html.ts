/**
 * Blog Email HTML Generator
 *
 * Pure function that generates HTML for blog draft notification emails.
 * Uses the same visual styling as the BlogPostContent component but
 * without React to avoid Next.js bundling issues.
 *
 * Reference: Blog Draft Email - Use Same Component as Blog Page Plan
 */

import { ZOCDOC_URL } from '@/lib/constants';
import type { BlogPost } from '@/lib/payload-api';

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Convert Lexical JSON content to HTML for email
 */
function lexicalToHtml(content: unknown): string {
  if (!content || typeof content !== 'object') {
    return '';
  }

  const lexicalContent = content as {
    root?: {
      children?: Array<{
        type: string;
        tag?: string;
        text?: string;
        listType?: string;
        children?: Array<{ text?: string; type?: string; children?: Array<{ text?: string }> }>;
      }>;
    };
  };

  if (!lexicalContent.root?.children) {
    return '';
  }

  const htmlParts: string[] = [];

  for (const node of lexicalContent.root.children) {
    // Get text content from node
    const getTextContent = (
      children?: Array<{ text?: string; type?: string; children?: Array<{ text?: string }> }>
    ): string => {
      if (!children) return '';
      return children
        .map((child) => {
          if (child.text) return escapeHtml(child.text);
          if (child.children) return getTextContent(child.children);
          return '';
        })
        .join('');
    };

    const textContent = getTextContent(node.children);

    switch (node.type) {
      case 'heading': {
        const tag = node.tag || 'h2';
        const styles: Record<string, string> = {
          h1: 'font-size: 32px; font-weight: 700; color: #111827; margin-top: 32px; margin-bottom: 16px;',
          h2: 'font-size: 28px; font-weight: 600; color: #111827; margin-top: 24px; margin-bottom: 12px;',
          h3: 'font-size: 24px; font-weight: 600; color: #111827; margin-top: 20px; margin-bottom: 8px;',
        };
        const style = styles[tag] || styles.h2;
        htmlParts.push(`<${tag} style="${style}">${textContent}</${tag}>`);
        break;
      }

      case 'paragraph':
        if (textContent.trim()) {
          htmlParts.push(
            `<p style="margin-bottom: 16px; line-height: 1.7;">${textContent}</p>`
          );
        }
        break;

      case 'list': {
        const listTag = node.listType === 'bullet' ? 'ul' : 'ol';
        const listItems = node.children
          ?.map((item) => {
            const itemText = getTextContent(
              (item as { children?: Array<{ text?: string }> }).children
            );
            return `<li style="margin-bottom: 6px; line-height: 1.7;">${itemText}</li>`;
          })
          .join('');
        htmlParts.push(
          `<${listTag} style="margin-top: 16px; margin-bottom: 16px; padding-left: 24px;">${listItems}</${listTag}>`
        );
        break;
      }

      default:
        if (textContent.trim()) {
          htmlParts.push(
            `<p style="margin-bottom: 16px;">${textContent}</p>`
          );
        }
    }
  }

  return htmlParts.join('\n');
}

/**
 * Generate blog post HTML for email
 *
 * Matches the same styling as BlogPostContent component
 */
export function generateBlogPostHtmlForEmail(post: BlogPost): string {
  // Format date
  const formattedDate = new Date(post.publishedDate).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  // Featured image
  const featuredImageHtml = post.featuredImage
    ? `
    <div style="margin-bottom: 32px;">
      <img
        src="${escapeHtml(post.featuredImage.url)}"
        alt="${escapeHtml(post.featuredImage.alt || post.title)}"
        style="width: 100%; height: auto; border-radius: 24px; background-color: #f9fafb;"
      />
    </div>
    `
    : '';

  // Convert Lexical content to HTML
  const contentHtml = lexicalToHtml(post.content);

  // Author section
  const authorHtml = `
    <div style="margin-top: 64px; overflow: hidden; border-radius: 0 0 6px 6px;">
      <div style="border-top: 1px solid #e5e7eb; padding: 24px; padding-top: 48px; position: relative; overflow: visible;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 112px; height: 112px; border-radius: 6px; background-color: #e5e7eb; display: flex; align-items: center; overflow: hidden; justify-content: center; flex-shrink: 0; position: relative;">
            <!-- Author image placeholder - email clients may not render local images -->
          </div>
          <div>
            <a href="${ZOCDOC_URL}" style="font-weight: 500; color: #111827; font-size: 20px; text-decoration: none;">
              ${escapeHtml(post.author)}
            </a>
            <p style="color: #4b5563; font-weight: 400; margin: 4px 0 0 0;">
              Eye Care Specialist at The NYC Optometrist
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  return `
    <div style="max-width: 768px; margin: 0 auto; padding: 64px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div>
        ${featuredImageHtml}

        <!-- Article Meta -->
        <div style="display: flex; align-items: center; gap: 16px; font-size: 14px; color: #4b5563; margin-bottom: 24px;">
          <span>${formattedDate}</span>
          <span style="background-color: #e5e7eb; padding: 4px 12px; border-radius: 9999px;">Eye Care</span>
        </div>

        <!-- Title -->
        <h1 style="font-size: 36px; font-weight: 700; color: #111827; margin-bottom: 24px; line-height: 1.2;">
          ${escapeHtml(post.title)}
        </h1>

        ${
          post.excerpt
            ? `
        <!-- Excerpt -->
        <p style="font-size: 20px; color: #4b5563; font-weight: 400; margin-bottom: 48px; line-height: 1.6;">
          ${escapeHtml(post.excerpt)}
        </p>
        `
            : ''
        }

        <!-- Content -->
        <div style="font-size: 18px; line-height: 1.7; color: #374151;">
          ${contentHtml}
        </div>

        ${authorHtml}
      </div>
    </div>
  `;
}
