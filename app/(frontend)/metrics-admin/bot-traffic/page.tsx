/**
 * Bot Traffic Admin Dashboard
 *
 * Reference: docs/cloudflare-analytics-plan.md
 *
 * Dedicated dashboard for analyzing AI bot traffic patterns.
 * Shows bot type breakdown, page analysis, and real-time feed.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Bot,
  RefreshCw,
  ArrowLeft,
  Globe,
  TrendingUp,
  Activity,
  FileText,
  Calendar,
} from 'lucide-react';

interface BotEventData {
  botProvider: string;
  botName: string;
  isAIBot: boolean;
  timestamp?: string;
}

interface BotEvent {
  id: string;
  createdAt: string;
  eventType: string;
  url: string;
  pathname: string;
  userAgent?: string;
  referrer?: string;
  eventData?: BotEventData;
}

interface BotMetricsResponse {
  events: BotEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: Array<{
    eventType: string;
    _count: { id: number };
  }>;
}

/** Bot provider colors for consistent styling */
const BOT_PROVIDER_COLORS: Record<string, { background: string; text: string; border: string }> = {
  openai: { background: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
  anthropic: { background: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  perplexity: { background: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  google: { background: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  microsoft: { background: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' },
  meta: { background: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  bytedance: { background: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  default: { background: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
};

function getBotProviderColor(provider: string) {
  return BOT_PROVIDER_COLORS[provider.toLowerCase()] || BOT_PROVIDER_COLORS.default;
}

export default function BotTrafficPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [metrics, setMetrics] = useState<BotMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d'>('7d');

  const authenticate = () => {
    const token = btoa(password);
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
    fetchBotMetrics();
  };

  const getDateRangeFilter = useCallback(() => {
    const now = new Date();
    const startDate = new Date();

    switch (dateRange) {
      case '24h':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
    }

    return startDate.toISOString().split('T')[0];
  }, [dateRange]);

  const fetchBotMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const queryParams = new URLSearchParams({
        eventType: 'ai_bot_visit',
        startDate: getDateRangeFilter(),
        limit: '100',
      });

      const response = await fetch(`/api/admin/metrics?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching bot metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [getDateRangeFilter]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchBotMetrics();
    }
  }, [fetchBotMetrics]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBotMetrics();
    }
  }, [dateRange, isAuthenticated, fetchBotMetrics]);

  /** Aggregate bot visits by provider */
  const botProviderBreakdown = useMemo(() => {
    if (!metrics?.events) return [];

    const providerCountMap: Record<string, { count: number; bots: Set<string> }> = {};

    metrics.events.forEach((event) => {
      const provider = event.eventData?.botProvider || 'unknown';
      const botName = event.eventData?.botName || 'Unknown';

      if (!providerCountMap[provider]) {
        providerCountMap[provider] = { count: 0, bots: new Set() };
      }
      providerCountMap[provider].count++;
      providerCountMap[provider].bots.add(botName);
    });

    return Object.entries(providerCountMap)
      .map(([provider, data]) => ({
        provider,
        count: data.count,
        bots: Array.from(data.bots),
      }))
      .sort((a, b) => b.count - a.count);
  }, [metrics?.events]);

  /** Aggregate page visits by pathname */
  const pageBreakdown = useMemo(() => {
    if (!metrics?.events) return [];

    const pageCountMap: Record<string, number> = {};

    metrics.events.forEach((event) => {
      const pathname = event.pathname;
      pageCountMap[pathname] = (pageCountMap[pathname] || 0) + 1;
    });

    return Object.entries(pageCountMap)
      .map(([pathname, count]) => ({ pathname, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [metrics?.events]);

  /** Get unique bot types */
  const uniqueBotTypes = useMemo(() => {
    if (!metrics?.events) return 0;

    const uniqueBots = new Set(
      metrics.events.map((event) => event.eventData?.botName).filter(Boolean)
    );
    return uniqueBots.size;
  }, [metrics?.events]);

  /** Get top bot */
  const topBot = useMemo(() => {
    if (!botProviderBreakdown.length) return null;

    const allBots: Record<string, number> = {};
    metrics?.events.forEach((event) => {
      const botName = event.eventData?.botName || 'Unknown';
      allBots[botName] = (allBots[botName] || 0) + 1;
    });

    const sorted = Object.entries(allBots).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? { name: sorted[0][0], count: sorted[0][1] } : null;
  }, [metrics?.events, botProviderBreakdown]);

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && authenticate()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={authenticate}
              className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalBotVisits = metrics?.pagination.total || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/metrics-admin/metrics"
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back
              </Link>
              <div className="flex items-center">
                <Bot className="w-8 h-8 text-cyan-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">AI Bot Traffic</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Date Range Selector */}
              <div className="flex rounded-md shadow-sm">
                {(['24h', '7d', '30d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 text-sm font-medium ${
                      dateRange === range
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } ${
                      range === '24h' ? 'rounded-l-md' : range === '30d' ? 'rounded-r-md' : ''
                    } border border-gray-300`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <button
                onClick={fetchBotMetrics}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Bot className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bot Visits</p>
                <p className="text-2xl font-bold text-gray-900">{totalBotVisits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Bot Types</p>
                <p className="text-2xl font-bold text-gray-900">{uniqueBotTypes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Bot</p>
                <p className="text-2xl font-bold text-gray-900">
                  {topBot?.name || 'N/A'}
                </p>
                {topBot && (
                  <p className="text-xs text-gray-500">{topBot.count} visits</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Period</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dateRange === '24h' ? 'Last 24 Hours' : dateRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bot Type Breakdown + Page Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bot Provider Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-cyan-600" />
              Bot Provider Breakdown
            </h3>
            {botProviderBreakdown.length > 0 ? (
              <div className="space-y-4">
                {botProviderBreakdown.map(({ provider, count, bots }) => {
                  const colors = getBotProviderColor(provider);
                  const percentage = totalBotVisits > 0 ? (count / totalBotVisits) * 100 : 0;

                  return (
                    <div key={provider}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors.background} ${colors.text}`}
                          >
                            {provider.charAt(0).toUpperCase() + provider.slice(1)}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({bots.join(', ')})
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors.background.replace('100', '500')}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No bot visits recorded in this time period
              </p>
            )}
          </div>

          {/* Most Visited Pages by Bots */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-cyan-600" />
              Pages Most Visited by Bots
            </h3>
            {pageBreakdown.length > 0 ? (
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-sm font-medium text-gray-700">
                        Page
                      </th>
                      <th className="text-right py-2 text-sm font-medium text-gray-700">
                        Visits
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageBreakdown.map(({ pathname, count }) => (
                      <tr key={pathname} className="border-b border-gray-100">
                        <td className="py-3 text-sm text-gray-900">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {pathname}
                          </code>
                        </td>
                        <td className="py-3 text-sm text-gray-900 text-right font-medium">
                          {count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No page data available
              </p>
            )}
          </div>
        </div>

        {/* Recent Bot Visits Feed */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Bot Visits</h3>
            <span className="text-sm text-gray-500">
              Showing latest {metrics?.events.length || 0} visits
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics?.events.map((event) => {
                  const provider = event.eventData?.botProvider || 'unknown';
                  const colors = getBotProviderColor(provider);

                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(event.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800">
                          {event.eventData?.botName || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors.background} ${colors.text}`}
                        >
                          {provider.charAt(0).toUpperCase() + provider.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {event.pathname}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {event.referrer || 'Direct'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!metrics?.events || metrics.events.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No bot visits recorded in this time period</p>
                <p className="text-sm mt-2">
                  AI bots like GPTBot, ClaudeBot, and PerplexityBot will appear here when they visit your site
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
