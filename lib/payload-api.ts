/**
 * Payload CMS API Client
 *
 * Functions for interacting with the Payload CMS blog content.
 * Extended with AI blog generation support for creating drafts
 * and one-click publishing.
 *
 * Reference: AI Blog Generation System Plan - Step 7
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: unknown // Lexical rich text content
  publishedDate: string
  author: string
  metaDescription?: string
  featuredImage?: {
    id: string
    url: string
    alt?: string
    width?: number
    height?: number
  }
  tags?: string[]
  publishToken?: string
  instagramCaption?: string
  instagramCarouselSlides?: Array<{ slideContent: string }>
  featuredImageSuggestion?: string
  bibliography?: string
  _status?: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export async function getBlogPosts(options?: {
  page?: number
  limit?: number
  status?: 'draft' | 'published'
}): Promise<{ docs: BlogPost[]; totalDocs: number; totalPages: number }> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'blog-posts',
    page: options?.page ?? 1,
    limit: options?.limit ?? 10,
    sort: '-publishedDate',
    where: options?.status ? { _status: { equals: options.status } } : {},
    depth: 1, // Include related media
  })

  return {
    docs: result.docs as BlogPost[],
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: { equals: slug },
    },
    depth: 1,
    limit: 1,
  })

  if (result.docs.length === 0) {
    return null
  }

  return result.docs[0] as BlogPost
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'blog-posts',
    limit: 100,
    depth: 0,
  })

  return result.docs
    .map((post) => (post as BlogPost).slug)
    .filter((slug): slug is string => Boolean(slug))
}

/**
 * Input data for creating a draft blog post
 * Reference: AI Blog Generation System Plan
 */
export interface CreateDraftBlogPostInput {
  title: string
  slug: string
  excerpt: string
  content: string // Markdown content (will be converted to Lexical)
  metaDescription: string
  tags: string[]
  instagramCaption?: string
  instagramCarouselSlides?: string[]
  featuredImageSuggestion?: string
  bibliography?: string
}

/**
 * Result of creating a draft blog post
 */
export interface CreateDraftBlogPostResult {
  id: string
  slug: string
  adminUrl: string
  publishToken: string
}

/**
 * Generate a secure publish token
 * Used for one-click publishing from email
 */
function generatePublishToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Convert markdown content to Lexical rich text format
 *
 * Lexical uses a specific JSON structure for rich text.
 * This creates a simple paragraph-based structure from markdown.
 */
function markdownToLexical(markdownContent: string): unknown {
  // Split content into paragraphs and create Lexical nodes
  const paragraphs = markdownContent.split(/\n\n+/)

  const children = paragraphs.map((paragraph) => {
    const trimmedParagraph = paragraph.trim()

    // Check for headers
    if (trimmedParagraph.startsWith('### ')) {
      return {
        type: 'heading',
        tag: 'h3',
        children: [{ type: 'text', text: trimmedParagraph.slice(4), version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      }
    }
    if (trimmedParagraph.startsWith('## ')) {
      return {
        type: 'heading',
        tag: 'h2',
        children: [{ type: 'text', text: trimmedParagraph.slice(3), version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      }
    }
    if (trimmedParagraph.startsWith('# ')) {
      return {
        type: 'heading',
        tag: 'h1',
        children: [{ type: 'text', text: trimmedParagraph.slice(2), version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      }
    }

    // Check for unordered list items
    if (trimmedParagraph.startsWith('- ') || trimmedParagraph.startsWith('* ')) {
      const listItems = trimmedParagraph.split('\n').filter(line => line.trim())
      return {
        type: 'list',
        listType: 'bullet',
        children: listItems.map(item => ({
          type: 'listitem',
          children: [{
            type: 'text',
            text: item.replace(/^[-*]\s*/, '').trim(),
            version: 1,
          }],
          direction: 'ltr',
          format: '',
          indent: 0,
          value: 1,
          version: 1,
        })),
        direction: 'ltr',
        format: '',
        indent: 0,
        start: 1,
        version: 1,
      }
    }

    // Default to paragraph
    return {
      type: 'paragraph',
      children: [{ type: 'text', text: trimmedParagraph, version: 1 }],
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      version: 1,
    }
  }).filter(node => {
    // Filter out empty paragraphs
    if (node.type === 'paragraph' && node.children) {
      const textContent = (node.children as Array<{ text?: string }>)
        .map(child => child.text || '')
        .join('')
      return textContent.trim().length > 0
    }
    return true
  })

  // Return Lexical root structure
  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

/**
 * Create a draft blog post from AI-generated content
 *
 * Saves the post as a draft in Payload CMS with a publish token
 * for secure one-click publishing from email.
 *
 * Reference: AI Blog Generation System Plan - Step 7
 */
export async function createDraftBlogPost(
  input: CreateDraftBlogPostInput
): Promise<CreateDraftBlogPostResult> {
  const payload = await getPayload({ config })

  // Generate a secure publish token
  const publishToken = generatePublishToken()

  // Convert markdown to Lexical format
  const lexicalContent = markdownToLexical(input.content)

  // Convert Instagram carousel slides to Payload array format
  const instagramCarouselPayloadFormat = input.instagramCarouselSlides?.map(
    (slideContent) => ({ slideContent })
  )

  // Create the draft post
  const result = await payload.create({
    collection: 'blog-posts',
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: lexicalContent,
      metaDescription: input.metaDescription,
      publishedDate: new Date().toISOString(),
      author: 'Dr. Joanna Latek',
      tags: input.tags,
      publishToken,
      instagramCaption: input.instagramCaption,
      instagramCarouselSlides: instagramCarouselPayloadFormat,
      featuredImageSuggestion: input.featuredImageSuggestion,
      bibliography: input.bibliography,
      _status: 'draft',
    },
    draft: true,
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thenycoptometrist.com'

  return {
    id: result.id as string,
    slug: input.slug,
    adminUrl: `${baseUrl}/admin/collections/blog-posts/${result.id}`,
    publishToken,
  }
}

/**
 * Publish a blog post by ID
 *
 * Changes status from draft to published. Optionally validates
 * the publish token for secure email publishing.
 *
 * Reference: AI Blog Generation System Plan - Step 10
 */
export async function publishBlogPost(
  postId: string,
  publishToken?: string
): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  const payload = await getPayload({ config })

  try {
    // Fetch the post to validate token if provided
    const existingPost = await payload.findByID({
      collection: 'blog-posts',
      id: postId,
      draft: true,
    })

    if (!existingPost) {
      return { success: false, error: 'Blog post not found' }
    }

    // Validate publish token if provided
    if (publishToken) {
      const storedToken = (existingPost as BlogPost).publishToken
      if (!storedToken || storedToken !== publishToken) {
        return { success: false, error: 'Invalid publish token' }
      }
    }

    // Update the post to published status
    const updatedPost = await payload.update({
      collection: 'blog-posts',
      id: postId,
      data: {
        _status: 'published',
        publishToken: null, // Clear token after use
      },
    })

    return {
      success: true,
      post: updatedPost as BlogPost,
    }
  } catch (error) {
    console.error('Failed to publish blog post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get a blog post by ID (including drafts)
 *
 * Useful for fetching the full post data for email notifications
 */
export async function getBlogPostById(
  postId: string,
  includeDrafts: boolean = true
): Promise<BlogPost | null> {
  const payload = await getPayload({ config })

  try {
    const result = await payload.findByID({
      collection: 'blog-posts',
      id: postId,
      draft: includeDrafts,
      depth: 1,
    })

    return result as BlogPost
  } catch {
    return null
  }
}
