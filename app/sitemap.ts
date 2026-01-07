import { MetadataRoute } from "next";
import { getBlogPosts, type BlogPost } from "@/lib/payload-api";
import { getAllProductSlugs } from "@/lib/products";

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

  // Fetch all product slugs
  let productSlugs: string[] = [];
  try {
    productSlugs = await getAllProductSlugs();
  } catch (error) {
    console.error("Failed to fetch product slugs for sitemap:", error);
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
    {
      url: `${baseUrl}/products`,
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

  // Product pages
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPostPages, ...productPages];
}