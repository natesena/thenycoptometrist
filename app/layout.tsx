import "./globals.css";

// Minimal root layout - each route group handles its own html/body
// Frontend: app/(frontend)/layout.tsx - full site with Menu, Footer, schema
// Payload:  app/(payload)/layout.tsx  - Payload CMS admin panel
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
