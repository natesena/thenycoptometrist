import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";
import Footer from "@/app/components/footer";
import Menu from "./components/header";

export const metadata: Metadata = {
  title: "Dr. Latek, Optometrist",
  description: "Your vision is our mission at The NYC Optometrist. We provide comprehensive eye care services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-background antialiased`}>
        <div>
          <Head>
            <title>Dr. Latek, Optometrist
            </title>
            <meta
              name="description"
              content="Your vision is our mission at The NYC Optometrist. We provide comprehensive eye care services."
            />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://www.thenycoptometrist.com" />
          </Head>
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
