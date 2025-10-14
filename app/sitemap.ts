import { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL || "https://www.thenycoptometrist.com";

  // Fetch all blog posts from Strapi
  let blogPosts: BlogPost[] = [];
  try {
    const response = await getBlogPosts(1, 100); // Get up to 100 blog posts
    blogPosts = response.data || [];
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
    url: `${baseUrl}/blog/${post.Slug || post.slug}`,
    lastModified: new Date(post.publishedDate || post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPostPages];
}