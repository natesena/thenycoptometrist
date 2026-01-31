/**
 * Blog Publish API Endpoint
 *
 * GET endpoint for one-click blog publishing from email.
 * Uses signed token to authenticate the publish request.
 *
 * Reference: AI Blog Generation System Plan - Step 10
 */

import { NextRequest, NextResponse } from 'next/server';
import { publishBlogPost } from '@/lib/payload-api';

// Force dynamic execution
export const dynamic = 'force-dynamic';

/**
 * GET /api/blog/publish?id=xxx&token=yyy
 *
 * Publishes a draft blog post using a secure token.
 * Called from the "Publish Now" button in email notifications.
 *
 * Query parameters:
 * - id: Blog post ID (required)
 * - token: Publish token (required)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postId = searchParams.get('id');
  const publishToken = searchParams.get('token');

  const requestId = `publish-${Date.now()}`;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thenycoptometrist.com';

  console.log(`[${requestId}] Publish request received`, {
    postId,
    hasToken: !!publishToken,
    timestamp: new Date().toISOString(),
  });

  // Validate parameters
  if (!postId) {
    console.error(`[${requestId}] Missing post ID`);
    return createErrorResponse(baseUrl, 'Missing blog post ID');
  }

  if (!publishToken) {
    console.error(`[${requestId}] Missing publish token`);
    return createErrorResponse(baseUrl, 'Missing publish token');
  }

  try {
    // Attempt to publish the post
    const result = await publishBlogPost(postId, publishToken);

    if (!result.success) {
      console.error(`[${requestId}] Publish failed:`, result.error);
      return createErrorResponse(baseUrl, result.error || 'Failed to publish');
    }

    const publishedPost = result.post;
    console.log(`[${requestId}] Post published successfully:`, {
      id: postId,
      title: publishedPost?.title,
      slug: publishedPost?.slug,
    });

    // Redirect to success page
    return createSuccessResponse(baseUrl, publishedPost?.title || 'Blog Post', publishedPost?.slug);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${requestId}] Unexpected error:`, errorMessage);
    return createErrorResponse(baseUrl, errorMessage);
  }
}

/**
 * Create HTML success response with redirect
 */
function createSuccessResponse(
  baseUrl: string,
  title: string,
  slug?: string
): NextResponse {
  const blogUrl = slug ? `${baseUrl}/blog/${slug}` : `${baseUrl}/blog`;
  const adminUrl = `${baseUrl}/admin/collections/blog-posts`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Published Successfully</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 500px;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      color: #27ae60;
      margin-bottom: 10px;
    }
    .title {
      color: #2c3e50;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 25px;
    }
    .button-row {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
    }
    .btn-primary {
      background-color: #27ae60;
      color: white;
    }
    .btn-secondary {
      background-color: #3498db;
      color: white;
    }
  </style>
  <meta http-equiv="refresh" content="3;url=${blogUrl}">
</head>
<body>
  <div class="container">
    <div class="success-icon">✅</div>
    <h1>Published Successfully!</h1>
    <div class="title">"${escapeHtml(title)}"</div>
    <p>Redirecting to your blog post in 3 seconds...</p>
    <div class="button-row">
      <a href="${blogUrl}" class="btn btn-primary">View Blog Post</a>
      <a href="${adminUrl}" class="btn btn-secondary">Admin Panel</a>
    </div>
  </div>
</body>
</html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}

/**
 * Create HTML error response
 */
function createErrorResponse(baseUrl: string, error: string): NextResponse {
  const adminUrl = `${baseUrl}/admin/collections/blog-posts`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Publish Failed</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 500px;
    }
    .error-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      color: #e74c3c;
      margin-bottom: 10px;
    }
    .error-message {
      color: #7f8c8d;
      margin-bottom: 25px;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-icon">❌</div>
    <h1>Publish Failed</h1>
    <p class="error-message">${escapeHtml(error)}</p>
    <p>Please try publishing from the admin panel instead.</p>
    <a href="${adminUrl}" class="btn">Open Admin Panel</a>
  </div>
</body>
</html>
  `;

  return new NextResponse(html, {
    status: 400,
    headers: { 'Content-Type': 'text/html' },
  });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
