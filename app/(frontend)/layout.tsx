import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/app/components/footer";
import Menu from "@/app/components/header";
import { AnalyticsTracker } from "@/app/components/AnalyticsTracker";
import { REVIEW_STATS } from "@/lib/review-stats";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thenycoptometrist.com'),

  title: "Dr. Latek, Optometrist",
  description: "Top-rated 2025 NYC optometrist serving five boroughs. Dr. Joanna Latek. Comprehensive exams, specialty contacts, dry eye, computer strain, tired eyes.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: 'https://www.thenycoptometrist.com',
  },

  openGraph: {
    type: 'website',
    url: 'https://www.thenycoptometrist.com',
    title: 'Dr. Joanna Latek - Top-rated 2025 NYC Optometrist',
    description: 'Top-rated 2025 NYC optometrist serving all five boroughs. Dr. Joanna Latek specializes in comprehensive eye exams, specialty contact lenses, dry eye treatment, computer strain, and tired eyes.',
    locale: 'en_US',
    siteName: 'The NYC Optometrist',
    images: [{
      url: 'https://storage.googleapis.com/thenycoptometrist-assets/og.png',
      width: 1200,
      height: 630,
      alt: `The NYC Optometrist - Dr. Joanna Latek - ${REVIEW_STATS.averageRating}★ Rating`
    }]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Joanna Latek - Top-rated 2025 NYC Optometrist',
    description: 'Top-rated 2025 NYC optometrist serving all five boroughs. Dr. Joanna Latek specializes in comprehensive eye exams, specialty contact lenses, dry eye treatment, computer strain, and tired eyes.',
    images: ['https://storage.googleapis.com/thenycoptometrist-assets/og.png'],
  },
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://www.thenycoptometrist.com/#localbusiness",
              "additionalType": "https://schema.org/Optician",
              "name": "The NYC Optometrist - Dr. Latek",
              "description": "Comprehensive eye care services including comprehensive eye exams, specialty contact lenses, dry eye evaluations, and more. Serving New York City with multiple convenient locations.",
              "url": "https://www.thenycoptometrist.com",
              "logo": "https://www.thenycoptometrist.com/logo.png",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": REVIEW_STATS.averageRating,
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": REVIEW_STATS.totalReviews,
                "reviewCount": REVIEW_STATS.totalReviews
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "159 1st Ave",
                "addressLocality": "New York",
                "addressRegion": "NY",
                "postalCode": "10003",
                "addressCountry": "US"
              },
              "telephone": "+1 (212) 228-0950",
              "priceRange": "$$",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Eye Care Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Comprehensive Eye Exams",
                      "description": "Thorough eye examination including visual clarity assessment, eye muscle coordination, and internal eye structure examination."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Specialty Contact Lens Exams",
                      "description": "Custom-fit specialty contact lenses for keratoconus, irregular astigmatism, and complex vision problems."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Dry Eye Evaluations",
                      "description": "Comprehensive assessment and treatment for dry eye conditions including IPL, meibomian gland expressions, and punctal plugs."
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Myopia Management",
                      "description": "Specialized treatments to slow the progression of nearsightedness in children."
                    }
                  }
                ]
              },
              "employee": {
                "@type": "Person",
                "name": "Dr. Latek",
                "jobTitle": "Doctor of Optometry",
                "worksFor": {
                  "@type": "Organization",
                  "name": "The NYC Optometrist"
                },
                "alumniOf": {
                  "@type": "EducationalOrganization",
                  "name": "State University of New York College of Optometry"
                },
                "hasCredential": [
                  {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "Doctorate",
                    "educationalLevel": "Doctoral",
                    "name": "Doctorate in Optometry"
                  },
                  {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "Certificate",
                    "name": "Microcredential Certificate - Anterior Segment & Specialty Contact Lenses"
                  }
                ]
              },
              "location": {
                "@type": "Place",
                "name": "Eye & Health",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "159 1st Ave",
                  "addressLocality": "New York",
                  "addressRegion": "NY",
                  "postalCode": "10003",
                  "addressCountry": "US"
                },
                "telephone": "+1 (212) 228-0950",
                "openingHoursSpecification": [
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "https://schema.org/Tuesday",
                    "opens": "10:00:00",
                    "closes": "18:00:00"
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "https://schema.org/Wednesday",
                    "opens": "10:00:00",
                    "closes": "18:00:00"
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "https://schema.org/Thursday",
                    "opens": "10:00:00",
                    "closes": "18:00:00"
                  }
                ]
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "New York",
                  "sameAs": "https://en.wikipedia.org/wiki/New_York_City"
                },
                {
                  "@type": "City",
                  "name": "Manhattan",
                  "sameAs": "https://en.wikipedia.org/wiki/Manhattan"
                }
              ]
            })
          }}
        />
      </head>
      <body className={`bg-background antialiased`}>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <div>
          <div className="">
            <Menu />
            <main className="">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
