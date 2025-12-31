import { getPayload } from 'payload'
import config from '@payload-config'

// Type for Payload blog post document
interface PayloadBlogPost {
  id: number | string
  title: string
  slug: string
  excerpt?: string
  content: unknown
  publishedDate: string
  author: string
  metaDescription?: string
  featuredImage?: {
    id: number | string
    url: string
    alt?: string
    width?: number
    height?: number
  }
  createdAt: string
  updatedAt: string
}

// Get Payload instance
async function getPayloadClient() {
  return await getPayload({ config })
}

// Transform Payload blog post to match existing BlogPost interface
function transformPost(post: PayloadBlogPost): BlogPost {
  return {
    id: typeof post.id === 'string' ? parseInt(post.id, 10) : post.id,
    documentId: String(post.id),
    title: post.title,
    slug: post.slug,
    Slug: post.slug, // Compatibility with Strapi capitalized field
    content: post.content,
    excerpt: post.excerpt,
    Excerpt: post.excerpt, // Compatibility with Strapi capitalized field
    publishedDate: post.publishedDate,
    author: post.author,
    metaDescription: post.metaDescription,
    featuredImage: post.featuredImage
      ? [
          {
            id: typeof post.featuredImage.id === 'string' ? parseInt(String(post.featuredImage.id), 10) : post.featuredImage.id,
            url: post.featuredImage.url,
            alternativeText: post.featuredImage.alt,
            width: post.featuredImage.width || 0,
            height: post.featuredImage.height || 0,
          },
        ]
      : undefined,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.updatedAt,
  }
}

/**
 * Get paginated list of published blog posts
 */
export async function getBlogPosts(
  page = 1,
  pageSize = 10
): Promise<StrapiResponse<BlogPost[]>> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'blog-posts',
    page,
    limit: pageSize,
    sort: '-publishedDate',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return {
    data: (result.docs as PayloadBlogPost[]).map(transformPost),
    meta: {
      pagination: {
        page: result.page || 1,
        pageSize: result.limit || pageSize,
        pageCount: result.totalPages || 1,
        total: result.totalDocs || 0,
      },
    },
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: {
        equals: slug,
      },
      _status: {
        equals: 'published',
      },
    },
    limit: 1,
  })

  if (!result.docs || result.docs.length === 0) {
    return null
  }

  return transformPost(result.docs[0] as PayloadBlogPost)
}

/**
 * Get all blog post slugs (for static generation)
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'blog-posts',
    limit: 100,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return (result.docs as PayloadBlogPost[])
    .map((post) => post.slug)
    .filter((slug): slug is string => Boolean(slug))
}

// Placeholder for image URL base (not needed with S3/GCS as they return full URLs)
export const PAYLOAD_URL = ''
