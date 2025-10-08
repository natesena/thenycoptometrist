import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/app/components/footer";
import Menu from "./components/header";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thenycoptometrist.com'),

  title: "Dr. Latek, Optometrist",
  description: "Your vision is our mission at The NYC Optometrist. We provide comprehensive eye care services.",

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: 'https://www.thenycoptometrist.com',
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
              "telephone": "+1 (646) 410-1544",
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
                "telephone": "+1 (646) 410-1544",
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
        <div>
          <div className="">
            <div className="relative z-[100]">
              <Menu />
            </div>
            <main className="">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
