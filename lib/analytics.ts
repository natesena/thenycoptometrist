// Client-side analytics utilities for tracking metrics

import { EventType } from '@prisma/client';

// JSON-serializable type definitions
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type EventData = Record<string, JsonValue>;

export interface TrackEventOptions {
  eventType: EventType;
  url?: string;
  pathname?: string;
  eventData?: EventData;
}

// Re-export EventType for convenience
export { EventType };

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
  trackEvent({ eventType: EventType.visit });
}

/**
 * Track a Book Now button click
 * @param eventData - Additional data (e.g., location, page)
 */
export function trackBookNow(eventData?: EventData): void {
  trackEvent({ eventType: EventType.book_now_clicked, eventData });
}

/**
 * Track a phone/call button click
 * @param eventData - Additional data (e.g., phone number, location)
 */
export function trackPhoneClick(eventData?: EventData): void {
  trackEvent({ eventType: EventType.phone_clicked, eventData });
}

/**
 * Track an email link click
 * @param eventData - Additional data (e.g., email address, location)
 */
export function trackEmailClick(eventData?: EventData): void {
  trackEvent({ eventType: EventType.email_clicked, eventData });
}

/**
 * Track a social media link click
 * @param eventData - Additional data (e.g., platform, location)
 */
export function trackSocialMediaClick(eventData?: EventData): void {
  trackEvent({ eventType: EventType.social_media_clicked, eventData });
}

/**
 * Track a product referral link click
 * @param eventData - Additional data (e.g., product, location)
 */
export function trackProductReferralClick(eventData?: EventData): void {
  trackEvent({ eventType: EventType.product_referral_clicked, eventData });
}

/**
 * Track a blog post link click
 * @param eventData - Additional data (e.g., post slug, location)
 */
export function trackBlogPostClick(eventData?: EventData): void {
  trackEvent({ eventType: EventType.blog_post_clicked, eventData });
}

/**
 * Track an external link click
 * @param eventData - Additional data (e.g., URL, location)
 */
export function trackExternalLinkClick(eventData?: EventData): void {
  trackEvent({ eventType: EventType.external_link_clicked, eventData });
}
