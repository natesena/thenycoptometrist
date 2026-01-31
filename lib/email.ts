import { Resend } from 'resend';
import type { BlogPost } from '@/lib/payload-api';
import { generateBlogPostHtmlForEmail } from '@/lib/blog-email-html';

// Lazy-initialize Resend client to avoid build-time errors
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  if (!resend) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return resend;
}

export interface AnalyticsData {
  // Current week metrics
  totalEvents: number;
  uniqueVisitors: number;
  bookNowClicks: number;
  phoneClicks: number;
  emailClicks: number;
  socialClicks: number;
  blogClicks: number;
  externalClicks: number;
  topPages: Array<{ pathname: string; views: number }>;

  // Previous week metrics for comparison
  previousTotalEvents: number;
  previousUniqueVisitors: number;
  previousBookNowClicks: number;
  previousPhoneClicks: number;
  previousEmailClicks: number;
  previousSocialClicks: number;
  previousBlogClicks: number;
  previousExternalClicks: number;

  // Date range
  startDate: string;
  endDate: string;
}

function calculatePercentChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? '+∞%' : '0%';
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(0)}%`;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function generateEmailHTML(data: AnalyticsData): string {
  const totalEventsChange = calculatePercentChange(data.totalEvents, data.previousTotalEvents);
  const uniqueVisitorsChange = calculatePercentChange(data.uniqueVisitors, data.previousUniqueVisitors);
  const bookNowChange = calculatePercentChange(data.bookNowClicks, data.previousBookNowClicks);
  const phoneChange = calculatePercentChange(data.phoneClicks, data.previousPhoneClicks);
  const emailChange = calculatePercentChange(data.emailClicks, data.previousEmailClicks);
  const socialChange = calculatePercentChange(data.socialClicks, data.previousSocialClicks);
  const blogChange = calculatePercentChange(data.blogClicks, data.previousBlogClicks);
  const externalChange = calculatePercentChange(data.externalClicks, data.previousExternalClicks);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Analytics Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    h2 {
      color: #2c3e50;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #ecf0f1;
    }
    .metric-label {
      color: #7f8c8d;
      font-weight: 500;
    }
    .metric-value {
      font-weight: 700;
      color: #2c3e50;
    }
    .trend-positive {
      color: #27ae60;
    }
    .trend-negative {
      color: #e74c3c;
    }
    .trend-neutral {
      color: #95a5a6;
    }
    .section {
      margin-bottom: 25px;
    }
    .date-range {
      background-color: #ecf0f1;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 25px;
      text-align: center;
      color: #7f8c8d;
      font-size: 14px;
    }
    .page-list {
      list-style: none;
      padding: 0;
    }
    .page-item {
      padding: 10px;
      background-color: #f8f9fa;
      margin-bottom: 8px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ecf0f1;
      text-align: center;
      color: #95a5a6;
      font-size: 12px;
    }
    .footer a {
      color: #3498db;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Weekly Analytics Report</h1>

    <div class="date-range">
      Report Period: ${data.startDate} - ${data.endDate}
    </div>

    <!-- OVERVIEW -->
    <div class="section">
      <h2>📈 OVERVIEW</h2>
      <div class="metric-row">
        <span class="metric-label">Total Events</span>
        <span class="metric-value">
          ${formatNumber(data.totalEvents)}
          <span class="${data.totalEvents >= data.previousTotalEvents ? 'trend-positive' : 'trend-negative'}">${totalEventsChange}</span>
        </span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Unique Visitors</span>
        <span class="metric-value">
          ${formatNumber(data.uniqueVisitors)}
          <span class="${data.uniqueVisitors >= data.previousUniqueVisitors ? 'trend-positive' : 'trend-negative'}">${uniqueVisitorsChange}</span>
        </span>
      </div>
    </div>

    <!-- CONVERSION EVENTS -->
    <div class="section">
      <h2>🎯 CONVERSION EVENTS</h2>
      <div class="metric-row">
        <span class="metric-label">Book Now Clicks</span>
        <span class="metric-value">
          ${formatNumber(data.bookNowClicks)}
          <span class="${data.bookNowClicks >= data.previousBookNowClicks ? 'trend-positive' : 'trend-negative'}">${bookNowChange}</span>
        </span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Phone Clicks</span>
        <span class="metric-value">
          ${formatNumber(data.phoneClicks)}
          <span class="${data.phoneClicks >= data.previousPhoneClicks ? 'trend-positive' : 'trend-negative'}">${phoneChange}</span>
        </span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Email Clicks</span>
        <span class="metric-value">
          ${formatNumber(data.emailClicks)}
          <span class="${data.emailClicks >= data.previousEmailClicks ? 'trend-positive' : 'trend-negative'}">${emailChange}</span>
        </span>
      </div>
    </div>

    <!-- PAGE VIEWS -->
    <div class="section">
      <h2>👀 TOP PAGES</h2>
      <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 15px;">
        ${formatNumber(data.uniqueVisitors)} total visits
        <span class="${data.uniqueVisitors >= data.previousUniqueVisitors ? 'trend-positive' : 'trend-negative'}">${uniqueVisitorsChange}</span>
      </p>
      <ul class="page-list">
        ${data.topPages.map((page, index) => `
          <li class="page-item">
            <span>${index + 1}. ${page.pathname}</span>
            <span class="metric-value">${formatNumber(page.views)} views</span>
          </li>
        `).join('')}
      </ul>
    </div>

    <!-- ENGAGEMENT -->
    <div class="section">
      <h2>🔗 ENGAGEMENT</h2>
      <div class="metric-row">
        <span class="metric-label">Social Media Clicks</span>
        <span class="metric-value">
          ${formatNumber(data.socialClicks)}
          <span class="${data.socialClicks >= data.previousSocialClicks ? 'trend-positive' : 'trend-negative'}">${socialChange}</span>
        </span>
      </div>
      <div class="metric-row">
        <span class="metric-label">Blog Post Clicks</span>
        <span class="metric-value">
          ${formatNumber(data.blogClicks)}
          <span class="${data.blogClicks >= data.previousBlogClicks ? 'trend-positive' : 'trend-negative'}">${blogChange}</span>
        </span>
      </div>
      <div class="metric-row">
        <span class="metric-label">External Link Clicks</span>
        <span class="metric-value">
          ${formatNumber(data.externalClicks)}
          <span class="${data.externalClicks >= data.previousExternalClicks ? 'trend-positive' : 'trend-negative'}">${externalChange}</span>
        </span>
      </div>
    </div>

    <div class="footer">
      <p>This report is automatically generated every Monday.</p>
      <p>View detailed analytics: <a href="https://www.thenycoptometrist.com/admin/metrics">Admin Dashboard</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// Contact form email interface and function
// Reference: Contact Form Email Implementation Plan
export interface ContactFormSubmission {
  name: string;
  email: string;
  message: string;
}

function generateContactFormEmailHTML(data: ContactFormSubmission): string {
  const submittedDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Escape HTML to prevent XSS in email
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const escapedName = escapeHtml(data.name);
  const escapedEmail = escapeHtml(data.email);
  const escapedMessage = escapeHtml(data.message).replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .submitted-info {
      background-color: #ecf0f1;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 25px;
      text-align: center;
      color: #7f8c8d;
      font-size: 14px;
    }
    .section-label {
      color: #2c3e50;
      font-weight: 600;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ecf0f1;
      padding-bottom: 5px;
    }
    .field-row {
      margin-bottom: 10px;
      padding: 8px 0;
    }
    .field-label {
      color: #7f8c8d;
      font-weight: 500;
      font-size: 14px;
    }
    .field-value {
      color: #2c3e50;
      font-weight: 600;
      margin-left: 10px;
    }
    .message-box {
      background-color: #f8f9fa;
      border-radius: 6px;
      padding: 15px;
      margin-top: 10px;
      border-left: 3px solid #3498db;
    }
    .message-content {
      color: #2c3e50;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .section {
      margin-bottom: 25px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #ecf0f1;
      text-align: center;
      color: #95a5a6;
      font-size: 12px;
    }
    .reply-hint {
      background-color: #e8f4f8;
      border-radius: 6px;
      padding: 12px;
      margin-top: 20px;
      text-align: center;
      color: #2980b9;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📬 New Contact Form Submission</h1>

    <div class="submitted-info">
      Submitted: ${submittedDate}<br>
      Source: thenycoptometrist.com
    </div>

    <!-- FROM SECTION -->
    <div class="section">
      <div class="section-label">FROM</div>
      <div class="field-row">
        <span class="field-label">Name:</span>
        <span class="field-value">${escapedName}</span>
      </div>
      <div class="field-row">
        <span class="field-label">Email:</span>
        <span class="field-value">${escapedEmail}</span>
      </div>
    </div>

    <!-- MESSAGE SECTION -->
    <div class="section">
      <div class="section-label">MESSAGE</div>
      <div class="message-box">
        <div class="message-content">${escapedMessage}</div>
      </div>
    </div>

    <div class="reply-hint">
      Reply directly to this email to respond to the sender.
    </div>

    <div class="footer">
      <p>This message was sent via the contact form on thenycoptometrist.com</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendContactFormEmail(data: ContactFormSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.ANALYTICS_EMAIL_RECIPIENT) {
      throw new Error('ANALYTICS_EMAIL_RECIPIENT is not configured');
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM is not configured');
    }

    const emailHTML = generateContactFormEmailHTML(data);
    const resendClient = getResendClient();

    const response = await resendClient.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.ANALYTICS_EMAIL_RECIPIENT,
      replyTo: data.email, // So recipient can reply directly to submitter
      subject: `📬 Website Contact: ${data.name}`,
      html: emailHTML,
    });

    console.log('Contact form email sent successfully:', response);

    return { success: true };
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sendAnalyticsReport(data: AnalyticsData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.ANALYTICS_EMAIL_RECIPIENT) {
      throw new Error('ANALYTICS_EMAIL_RECIPIENT is not configured');
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM is not configured');
    }

    const emailHTML = generateEmailHTML(data);
    const resendClient = getResendClient();

    const response = await resendClient.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.ANALYTICS_EMAIL_RECIPIENT,
      subject: `📊 Weekly Analytics Report: ${data.startDate} - ${data.endDate}`,
      html: emailHTML,
    });

    console.log('Analytics email sent successfully:', response);

    return { success: true };
  } catch (error) {
    console.error('Failed to send analytics email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Blog draft notification email interface and function
// Reference: Blog Draft Email - Use Same Component as Blog Page Plan
export interface BlogDraftNotificationData {
  post: BlogPost;
  adminUrl: string;
  publishToken: string;
}

/**
 * Generate the blog draft notification email HTML
 *
 * Uses the same visual styling as the BlogPostContent component
 * to ensure consistency between email preview and live site.
 *
 * Reference: Blog Draft Email - Use Same Component as Blog Page Plan
 */
function generateBlogDraftEmailHTML(data: BlogDraftNotificationData): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thenycoptometrist.com';
  const publishUrl = `${baseUrl}/api/blog/publish?token=${encodeURIComponent(data.publishToken)}&id=${encodeURIComponent(data.post.id)}`;

  // Generate blog post HTML using pure function (same styling as BlogPostContent)
  const blogPostHtml = generateBlogPostHtmlForEmail(data.post);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Blog Draft: ${data.post.title}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <!-- Blog content (same styling as website) -->
    ${blogPostHtml}

    <!-- Footer with action buttons -->
    <div style="margin-top: 30px; padding: 30px; border-top: 1px solid #e5e7eb; text-align: center; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
      <p style="color: #6b7280; font-size: 13px; margin-bottom: 24px;">
        This draft was AI-generated. Review before publishing.
      </p>

      <div style="margin-bottom: 20px;">
        <a href="${publishUrl}" style="display: inline-block; background-color: #22c55e; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 0 8px 10px;">
          Publish Now
        </a>
        <a href="${data.adminUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 0 8px 10px;">
          Edit in Admin
        </a>
      </div>

      <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
        Publish link expires in 7 days.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function sendBlogDraftNotification(
  data: BlogDraftNotificationData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.ANALYTICS_EMAIL_RECIPIENT) {
      throw new Error('ANALYTICS_EMAIL_RECIPIENT is not configured');
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM is not configured');
    }

    const emailHTML = generateBlogDraftEmailHTML(data);
    const resendClient = getResendClient();

    const response = await resendClient.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.ANALYTICS_EMAIL_RECIPIENT,
      subject: `📝 New Blog Draft: ${data.post.title}`,
      html: emailHTML,
    });

    console.log('Blog draft notification email sent successfully:', response);

    return { success: true };
  } catch (error) {
    console.error('Failed to send blog draft notification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
