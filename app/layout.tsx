import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Footer from "@/app/components/footer";
import Menu from "./components/header";
import { AnalyticsTracker } from "@/app/components/AnalyticsTracker";

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
      alt: 'The NYC Optometrist - Dr. Joanna Latek - 4.92★ Rating'
    }]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Joanna Latek - Top-rated 2025 NYC Optometrist',
    description: 'Top-rated 2025 NYC optometrist serving all five boroughs. Dr. Joanna Latek specializes in comprehensive eye exams, specialty contact lenses, dry eye treatment, computer strain, and tired eyes.',
    images: ['https://storage.googleapis.com/thenycoptometrist-assets/og.png'],
  },
};

export default function RootLayout({
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the difference between an optometrist and an ophthalmologist?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An optometrist (OD) provides primary vision care including eye exams, diagnosis of common eye conditions, contact lens fitting, and non-surgical treatment. An ophthalmologist (MD/DO) is a medical doctor who performs eye surgery and handles complex medical conditions. In New York, they work together in a co-management model for comprehensive patient care."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What does a comprehensive eye exam include?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A comprehensive eye exam includes assessment of visual clarity, eye muscle coordination, peripheral vision, and examination of internal eye structures using advanced diagnostic tools. It can detect early signs of glaucoma, macular degeneration, and diabetic retinopathy, plus provides personalized vision correction recommendations."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are specialty contact lenses?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Specialty contact lenses are custom-designed lenses for complex vision problems that standard lenses cannot correct. These include scleral lenses, hybrid lenses, and rigid gas permeable lenses for conditions like keratoconus, irregular astigmatism, and severe dry eye."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is dry eye treatment?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Dry eye treatment includes personalized routines with medications, specialized treatments such as IPL (Intense Pulsed Light), Meibomian Gland Expressions, and Punctal Plug insertions to restore optimal tear film quality and relieve discomfort."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is myopia management for children?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Myopia management is a personalized approach to slow the progression of nearsightedness in children. It may include specialized contact lenses, prescription eyeglasses, or orthokeratology (overnight lenses). Early intervention can significantly reduce the risk of severe myopia and related complications later in life."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Dr. Latek accept insurance?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, Dr. Latek accepts both medical and vision insurance for eye care services including routine eye exams and corrective lenses. Contact the office at (212) 228-0950 for specific insurance questions."
                  }
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
