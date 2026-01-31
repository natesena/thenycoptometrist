import { MetadataRoute } from "next";
import { getBlogPosts, type BlogPost } from "@/lib/payload-api";

// SEO Fix: Revalidate sitemap every hour to pick up new blog posts
// Reference: Blog & SEO Fixes plan - Issue 4
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL || "https://www.thenycoptometrist.com";

  // Fetch all blog posts from Payload CMS
  let blogPosts: BlogPost[] = [];
  try {
    const result = await getBlogPosts({ limit: 100, status: 'published' });
    blogPosts = result.docs;
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  // Main pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Blog post pages
  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPostPages];
}