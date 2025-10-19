'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

/**
 * Client component that automatically tracks page views
 * Place this in your root layout to track all page visits
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track initial page view
    trackPageView();
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
