import { MetadataRoute } from "next";

// SEO Fix: Hardcode fallback URL to prevent "Sitemap: undefined/sitemap.xml"
// Reference: Blog & SEO Fixes plan - Issue 2
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.BASE_URL || "https://www.thenycoptometrist.com";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}