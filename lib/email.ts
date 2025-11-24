import { Resend } from 'resend';

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

export async function sendAnalyticsReport(data: AnalyticsData): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.ANALYTICS_EMAIL_RECIPIENT) {
      throw new Error('ANALYTICS_EMAIL_RECIPIENT is not configured');
    }

    if (!process.env.ANALYTICS_EMAIL_FROM) {
      throw new Error('ANALYTICS_EMAIL_FROM is not configured');
    }

    const emailHTML = generateEmailHTML(data);
    const resendClient = getResendClient();

    const response = await resendClient.emails.send({
      from: process.env.ANALYTICS_EMAIL_FROM,
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
