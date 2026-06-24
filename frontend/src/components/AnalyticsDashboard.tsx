/**
 * Professional Analytics Dashboard Component
 * Displays comprehensive metrics and insights
 */

'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardMetrics {
  totalDocuments: number;
  completedAnalysis: number;
  highRiskCount: number;
  complianceRate: number;
  analysisTimeTrend: Array<{ date: string; count: number }>;
  riskDistribution: Array<{ name: string; value: number; color: string }>;
  topIssues: Array<{ issue: string; count: number }>;
  teamMetrics: { activeUsers: number; documentsShared: number; avgAnalysisTime: number };
}

interface AnalyticsDashboardProps {
  metrics?: DashboardMetrics;
  isLoading?: boolean;
}

const mockMetrics: DashboardMetrics = {
  totalDocuments: 156,
  completedAnalysis: 142,
  highRiskCount: 23,
  complianceRate: 87,
  analysisTimeTrend: [
    { date: 'Week 1', count: 12 },
    { date: 'Week 2', count: 19 },
    { date: 'Week 3', count: 15 },
    { date: 'Week 4', count: 28 },
    { date: 'Week 5', count: 22 },
  ],
  riskDistribution: [
    { name: 'Low Risk', value: 89, color: '#38a169' },
    { name: 'Medium Risk', value: 43, color: '#f6ad55' },
    { name: 'High Risk', value: 18, color: '#c53030' },
    { name: 'Unanalyzed', value: 14, color: '#cbd5e0' },
  ],
  topIssues: [
    { issue: 'Missing Termination Clause', count: 34 },
    { issue: 'Unlimited Liability', count: 28 },
    { issue: 'Data Privacy Concerns', count: 23 },
    { issue: 'Unclear Payment Terms', count: 19 },
    { issue: 'Ambiguous Jurisdiction', count: 15 },
  ],
  teamMetrics: { activeUsers: 8, documentsShared: 45, avgAnalysisTime: 3.2 },
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  metrics = mockMetrics,
  isLoading = false,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time insights into your legal document analysis</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-6">
            <div className="min-w-[220px] md:min-w-0">
              <MetricCard
                title="Total Documents"
                value={metrics.totalDocuments}
                icon="📄"
                change="+12%"
                color="blue"
              />
            </div>
            <div className="min-w-[220px] md:min-w-0">
              <MetricCard
                title="Completed Analysis"
                value={metrics.completedAnalysis}
                icon="✅"
                change={`${metrics.totalDocuments ? ((metrics.completedAnalysis / metrics.totalDocuments) * 100).toFixed(1) : 0}%`}
                color="green"
              />
            </div>
            <div className="min-w-[220px] md:min-w-0">
              <MetricCard
                title="High Risk Items"
                value={metrics.highRiskCount}
                icon="⚠️"
                change="+5"
                color="red"
              />
            </div>
            <div className="min-w-[220px] md:min-w-0">
              <MetricCard
                title="Compliance Rate"
                value={`${metrics.complianceRate}%`}
                icon="✓"
                change="+3%"
                color="purple"
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Analysis Trend */}
          <div className="bg-white rounded-lg shadow p-6" role="region" aria-label="Analysis trend chart">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Trend</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={metrics.analysisTimeTrend} aria-hidden={false}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2d3748"
                  strokeWidth={2}
                  dot={{ fill: '#2d3748', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-lg shadow p-6" role="region" aria-label="Risk distribution chart">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Distribution</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={metrics.riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Issues */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Issues Found</h2>
            <div className="space-y-4">
              {metrics.topIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between" role="listitem">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{issue.issue}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(issue.count / metrics.topIssues[0].count) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-sm font-semibold text-gray-900">
                    {issue.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Metrics</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.teamMetrics.activeUsers}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Documents Shared</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.teamMetrics.documentsShared}</p>
                </div>
                <div className="text-4xl">📤</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Avg Analysis Time</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {metrics.teamMetrics.avgAnalysisTime}m
                  </p>
                </div>
                <div className="text-4xl">⏱️</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  change: string;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, change, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  const textColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  };

  return (
    <div
      className={`${colorClasses[color]} border rounded-lg p-6 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      role="group"
      aria-label={`${title} metric`}
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${textColorClasses[color]} mt-1`}>{value}</p>
          <p className="text-xs text-gray-500 mt-2">{change} from last period</p>
        </div>
        <div className="text-4xl" aria-hidden>{icon}</div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
