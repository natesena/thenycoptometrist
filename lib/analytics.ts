// Client-side analytics utilities for tracking metrics

export interface TrackEventOptions {
  eventType: 'visit' | 'click';
  url?: string;
  pathname?: string;
  eventData?: Record<string, any>;
}

/**
 * Send a tracking event to the metrics API
 * Fails silently to not break the user experience
 */
async function trackEvent(options: TrackEventOptions): Promise<void> {
  try {
    // Get current URL info if not provided
    const url = options.url || window.location.href;
    const pathname = options.pathname || window.location.pathname;

    // Prepare event data
    const eventData = {
      eventType: options.eventType,
      url,
      pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer || null,
      eventData: options.eventData || null,
    };

    // Send to API (don't await - fire and forget)
    fetch('/api/metrics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
      // Use keepalive to ensure request completes even if page unloads
      keepalive: true,
    }).catch((error) => {
      // Silently fail - don't break user experience
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to track event:', error);
      }
    });
  } catch (error) {
    // Silently fail - don't break user experience
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error in trackEvent:', error);
    }
  }
}

/**
 * Track a page visit
 */
export function trackPageView(): void {
  trackEvent({ eventType: 'visit' });
}

/**
 * Track a click event
 * @param eventData - Additional data about the click (e.g., button name, link URL)
 */
export function trackClick(eventData?: Record<string, any>): void {
  trackEvent({ eventType: 'click', eventData });
}
