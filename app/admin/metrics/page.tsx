'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Download, Filter, RefreshCw, Eye, MousePointer, Calendar, Globe, Clock } from 'lucide-react';

// Time frame presets for quick selection
const TIME_PRESETS = [
  { label: 'Today', days: 0 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: 'All time', days: -1 },
] as const;

const DEFAULT_PRESET = '30 days';
const DEFAULT_DAYS = 30;

// Calculate default date range (last 30 days)
function getDefaultDateRange() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - DEFAULT_DAYS);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

interface MetricsEvent {
  id: string;
  createdAt: string;
  eventType: string;
  url: string;
  pathname: string;
  userAgent?: string;
  referrer?: string;
  eventData?: Record<string, unknown>;
}

interface MetricsResponse {
  events: MetricsEvent[];
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


export default function AdminMetricsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(() => {
    const { startDate, endDate } = getDefaultDateRange();
    return {
      startDate,
      endDate,
      eventType: '',
      pathname: '',
      page: 1,
    };
  });
  const [activePreset, setActivePreset] = useState<string | null>(DEFAULT_PRESET);

  // Helper function to apply time preset
  const applyTimePreset = (days: number, label: string) => {
    setActivePreset(label);
    if (days === -1) {
      // All time - clear date filters
      setFilters(prev => ({ ...prev, startDate: '', endDate: '', page: 1 }));
    } else {
      const endDate = new Date();
      const startDate = new Date();
      if (days === 0) {
        // Today only
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate.setDate(startDate.getDate() - days);
      }
      setFilters(prev => ({
        ...prev,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        page: 1,
      }));
    }
  };

  const authenticate = () => {
    const token = btoa(password);
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
    setAuthError('');
    fetchMetrics();
  };

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/admin/metrics?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const exportData = async (format: 'json' | 'csv') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/metrics', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...filters, format }),
      });

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'metrics-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'metrics-export.json';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchMetrics();
    }
  }, [fetchMetrics]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics();
    }
  }, [filters, isAuthenticated, fetchMetrics]);

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {authError && (
              <p className="text-red-600 text-sm">{authError}</p>
            )}
            <button
              onClick={authenticate}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile optimized */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => exportData('csv')}
                className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                CSV
              </button>
              <button
                onClick={() => exportData('json')}
                className="flex items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                JSON
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  setIsAuthenticated(false);
                }}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Quick Time Presets */}
        <div className="bg-white rounded-lg shadow mb-4 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Time Frame</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TIME_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyTimePreset(preset.days, preset.label)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  activePreset === preset.label
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 p-3 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Filters
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
            <div className="col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Start</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => {
                  setActivePreset(null);
                  setFilters(prev => ({ ...prev, startDate: e.target.value }));
                }}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs text-gray-500 mb-1">End</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => {
                  setActivePreset(null);
                  setFilters(prev => ({ ...prev, endDate: e.target.value }));
                }}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Event Type</label>
              <select
                value={filters.eventType}
                onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value }))}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Events</option>
                <option value="visit">Page Visits</option>
                <option value="book_now_clicked">Book Now Clicks</option>
                <option value="phone_clicked">Phone Clicks</option>
                <option value="email_clicked">Email Clicks</option>
                <option value="social_media_clicked">Social Media Clicks</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Path</label>
              <input
                type="text"
                placeholder="Filter by path"
                value={filters.pathname}
                onChange={(e) => setFilters(prev => ({ ...prev, pathname: e.target.value }))}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs text-gray-500 mb-1 invisible">Action</label>
              <button
                onClick={fetchMetrics}
                disabled={loading}
                className="w-full flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {metrics && (
          <>
            {/* Summary Cards - Mobile optimized with 2x2 grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg shrink-0">
                    <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="ml-2 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Events</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{metrics.pagination.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg shrink-0">
                    <MousePointer className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div className="ml-2 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Page Views</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {metrics.summary.find(s => s.eventType === 'visit')?._count.id || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg shrink-0">
                    <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="ml-2 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Bookings</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {metrics.summary.find(s => s.eventType === 'book_now_clicked')?._count.id || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <div className="flex items-center">
                  <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg shrink-0">
                    <Globe className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div className="ml-2 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Conv. Rate</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {metrics.pagination.total > 0
                        ? ((metrics.summary.find(s => s.eventType === 'book_now_clicked')?._count.id || 0) / metrics.pagination.total * 100).toFixed(1)
                        : 0
                      }%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Event Type Distribution */}
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Event Distribution</h3>
                <div className="space-y-3 sm:space-y-4">
                  {metrics.summary.map((item, index) => {
                    const percentage = (item._count.id / metrics.pagination.total) * 100;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
                    const label = item.eventType.replace(/_/g, ' ');
                    return (
                      <div key={item.eventType}>
                        <div className="flex justify-between text-xs sm:text-sm mb-1">
                          <span className="font-medium text-gray-700 capitalize truncate">{label}</span>
                          <span className="font-medium text-gray-900 ml-2">{item._count.id}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2 sm:h-3">
                          <div
                            className={`h-2 sm:h-3 rounded-full ${colors[index % colors.length]}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Event Type Table */}
              <div className="bg-white rounded-lg shadow p-3 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Events by Type</h3>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-xs sm:text-sm font-medium text-gray-700">Event Type</th>
                        <th className="text-right py-2 text-xs sm:text-sm font-medium text-gray-700">Count</th>
                        <th className="text-right py-2 text-xs sm:text-sm font-medium text-gray-700">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.summary
                        .sort((a, b) => b._count.id - a._count.id)
                        .map((item) => {
                          const percentage = (item._count.id / metrics.pagination.total) * 100;
                          return (
                            <tr key={item.eventType} className="border-b border-gray-100">
                              <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-900 capitalize">
                                {item.eventType.replace(/_/g, ' ')}
                              </td>
                              <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-900 text-right font-medium">
                                {item._count.id}
                              </td>
                              <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-600 text-right">
                                {percentage.toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Events Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold">Recent Events</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Path
                      </th>
                      <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                        Referrer
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.events.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          <span className="hidden sm:inline"> {new Date(event.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                          <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${
                            event.eventType === 'visit' ? 'bg-blue-100 text-blue-800' :
                            event.eventType === 'book_now_clicked' ? 'bg-green-100 text-green-800' :
                            event.eventType === 'phone_clicked' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.eventType.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 max-w-[100px] sm:max-w-none truncate">
                          {event.pathname}
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-500 max-w-xs truncate hidden sm:table-cell">
                          {event.referrer || 'Direct'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!metrics.pagination.hasPrev}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!metrics.pagination.hasNext}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((metrics.pagination.page - 1) * metrics.pagination.limit) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(metrics.pagination.page * metrics.pagination.limit, metrics.pagination.total)}
                      </span> of{' '}
                      <span className="font-medium">{metrics.pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={!metrics.pagination.hasPrev}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {metrics.pagination.page} of {metrics.pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={!metrics.pagination.hasNext}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}