import Link from 'next/link';
import type { Metadata } from 'next';
import { ZOCDOC_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: '404 - Page Not Found | The NYC Optometrist',
  description: 'The page you are looking for could not be found. Visit our homepage or book an appointment with Dr. Joanna Latek.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-federalBlue mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-federalBlue text-white rounded-lg font-medium hover:bg-federalBlue/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Return Home
          </Link>
          <a
            href={ZOCDOC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-federalBlue text-federalBlue rounded-lg font-medium hover:bg-federalBlue hover:text-white transition-all duration-300"
          >
            Book Appointment
          </a>
        </div>

        <div className="mt-12">
          <p className="text-gray-600 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#services" className="text-federalBlue hover:underline">
              Services
            </Link>
            <Link href="/#about-me" className="text-federalBlue hover:underline">
              About Dr. Latek
            </Link>
            <Link href="/blog" className="text-federalBlue hover:underline">
              Blog
            </Link>
            <Link href="/#contact-us" className="text-federalBlue hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
