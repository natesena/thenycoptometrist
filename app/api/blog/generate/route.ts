/**
 * Blog Generation API Endpoint
 *
 * POST endpoint for programmatically triggering AI blog generation.
 * Can be called from cron jobs, agent runners, or manual triggers.
 *
 * Reference: AI Blog Generation System Plan - Step 9
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { generateBlogPost, formatResultForDisplay } from '@/lib/blog-generator';
import { createDraftBlogPost, getBlogPostById } from '@/lib/payload-api';
import { sendBlogDraftNotification } from '@/lib/email';

// Force dynamic execution to prevent caching
export const dynamic = 'force-dynamic';

/**
 * POST /api/blog/generate
 *
 * Request body:
 * - topic?: string - Topic category name/ID or specific topic
 * - model?: string - AI model override
 * - sendEmail?: boolean - Whether to send notification email (default: true)
 *
 * Authentication: CRON_SECRET or internal use
 */
export async function POST(request: NextRequest) {
  const requestId = `blog-gen-${Date.now()}`;

  console.log(`[${requestId}] Blog generation triggered`, {
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
  });

  try {
    // Verify authorization
    // Accept: Payload admin session OR bearer token (CRON_SECRET / BLOG_API_SECRET)
    let authorized = false;

    // Check Payload admin session first (for admin UI button)
    try {
      const payload = await getPayload({ config });
      const { user } = await payload.auth({ headers: request.headers });
      if (user) {
        authorized = true;
        console.log(`[${requestId}] Authorized via admin session: ${user.email}`);
      }
    } catch {
      // Session auth failed, fall through to bearer token check
    }

    // Fall back to bearer token auth (for cron jobs / API calls)
    if (!authorized) {
      const authHeader = request.headers.get('authorization');
      const cronSecret = process.env.CRON_SECRET;
      const apiSecret = process.env.BLOG_API_SECRET || process.env.CRON_SECRET;

      if (apiSecret) {
        if (authHeader === `Bearer ${apiSecret}` || authHeader === `Bearer ${cronSecret}`) {
          authorized = true;
        }
      } else {
        console.warn(`[${requestId}] No API secret configured - allowing request`);
        authorized = true;
      }
    }

    if (!authorized) {
      console.error(`[${requestId}] Unauthorized request`);
      return NextResponse.json(
        { success: false, requestId, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    let body: {
      topic?: string;
      model?: string;
      sendEmail?: boolean;
    } = {};

    try {
      body = await request.json();
    } catch {
      // Empty body is OK - will use defaults
    }

    const { topic, model, sendEmail = true } = body;

    console.log(`[${requestId}] Generation options:`, { topic, model, sendEmail });

    // Step 1: Generate blog content
    console.log(`[${requestId}] Starting blog generation...`);
    const generationResult = await generateBlogPost({
      topicCategoryOverride: topic,
      modelOverride: model,
    });

    console.log(`[${requestId}] Generated: "${generationResult.title}"`);
    console.log(formatResultForDisplay(generationResult));

    // Step 2: Save to Payload CMS as draft
    console.log(`[${requestId}] Saving draft to Payload CMS...`);
    const draftResult = await createDraftBlogPost({
      title: generationResult.title,
      slug: generationResult.slug,
      excerpt: generationResult.excerpt,
      content: generationResult.content,
      metaDescription: generationResult.metaDescription,
      tags: generationResult.tags,
      instagramCaption: generationResult.instagramCaption,
      instagramCarouselSlides: generationResult.instagramCarouselSlides,
      featuredImageSuggestion: generationResult.featuredImageSuggestion,
      bibliography: generationResult.bibliography,
    });

    console.log(`[${requestId}] Draft saved:`, {
      id: draftResult.id,
      adminUrl: draftResult.adminUrl,
    });

    // Step 3: Send email notification
    // Reference: Blog Draft Email - Use Same Component as Blog Page Plan
    let emailSent = false;
    if (sendEmail) {
      console.log(`[${requestId}] Fetching post for email notification...`);

      // Fetch the full post object for the email template
      // This uses the same BlogPostContent component as the website
      const fullPost = await getBlogPostById(draftResult.id, true);

      if (!fullPost) {
        console.warn(`[${requestId}] Could not fetch post for email - skipping notification`);
      } else {
        console.log(`[${requestId}] Sending email notification...`);
        const emailResult = await sendBlogDraftNotification({
          post: fullPost,
          adminUrl: draftResult.adminUrl,
          publishToken: draftResult.publishToken,
        });

        emailSent = emailResult.success;
        if (!emailResult.success) {
          console.warn(`[${requestId}] Email failed:`, emailResult.error);
        }
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      requestId,
      message: 'Blog post generated successfully',
      draft: {
        id: draftResult.id,
        title: generationResult.title,
        slug: generationResult.slug,
        adminUrl: draftResult.adminUrl,
        topicCategory: generationResult.topicCategory.categoryName,
        tags: generationResult.tags,
      },
      emailSent,
      modelInfo: generationResult.modelInfo,
      generatedAt: generationResult.generatedAt,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error(`[${requestId}] Generation failed:`, {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        requestId,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/blog/generate
 *
 * Returns endpoint documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/blog/generate',
    method: 'POST',
    description: 'Generate an AI-powered blog post draft',
    authentication: 'Bearer token (CRON_SECRET or BLOG_API_SECRET)',
    requestBody: {
      topic: 'Optional topic category name or specific topic',
      model: 'Optional AI model override',
      sendEmail: 'Whether to send notification email (default: true)',
    },
    availableTopics: [
      'Comprehensive Eye Exams',
      'Contact Lenses',
      'Pediatrics',
      'Hot Topics',
      'Dry Eyes',
      'Eyeglasses & Vision Correction',
      'Myopia Management',
      'Disease',
      'Vision Therapy',
    ],
  });
}
