import { getPayload } from 'payload'
import config from '@payload-config'

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
