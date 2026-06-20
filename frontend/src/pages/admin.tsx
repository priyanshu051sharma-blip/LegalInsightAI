/**
 * Admin Dashboard Page
 * System management, user administration, and settings
 */

'use client';

import React, { useState } from 'react';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  failedAnalysis: number;
  systemUptime: number;
  averageResponseTime: number;
  databaseSize: string;
  storageUsed: string;
}

interface UserLog {
  id: string;
  user: string;
  email: string;
  action: string;
  timestamp: string;
  status: 'success' | 'failed';
  ipAddress: string;
}

const mockMetrics: SystemMetrics = {
  totalUsers: 156,
  activeUsers: 89,
  totalDocuments: 3420,
  failedAnalysis: 12,
  systemUptime: 99.97,
  averageResponseTime: 245,
  databaseSize: '48 GB',
  storageUsed: '156 GB',
};

const mockLogs: UserLog[] = [
  {
    id: '1',
    user: 'Sarah Johnson',
    email: 'sarah@firm.com',
    action: 'Document uploaded',
    timestamp: '2024-06-20 14:32',
    status: 'success',
    ipAddress: '192.168.1.100',
  },
  {
    id: '2',
    user: 'Michael Chen',
    email: 'michael@firm.com',
    action: 'Analysis started',
    timestamp: '2024-06-20 14:28',
    status: 'success',
    ipAddress: '192.168.1.101',
  },
  {
    id: '3',
    user: 'Emily Rodriguez',
    email: 'emily@firm.com',
    action: 'Report exported',
    timestamp: '2024-06-20 14:15',
    status: 'success',
    ipAddress: '192.168.1.102',
  },
  {
    id: '4',
    user: 'Unknown User',
    email: 'test@example.com',
    action: 'Login attempt',
    timestamp: '2024-06-20 13:45',
    status: 'failed',
    ipAddress: '203.0.113.45',
  },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System management and monitoring</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              System Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'audit'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* System Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricBox
                label="Total Users"
                value={mockMetrics.totalUsers}
                subtext={`${mockMetrics.activeUsers} active`}
                color="blue"
              />
              <MetricBox
                label="System Uptime"
                value={`${mockMetrics.systemUptime}%`}
                subtext="Last 30 days"
                color="green"
              />
              <MetricBox
                label="Response Time"
                value={`${mockMetrics.averageResponseTime}ms`}
                subtext="Average"
                color="purple"
              />
              <MetricBox
                label="Failed Analysis"
                value={mockMetrics.failedAnalysis}
                subtext="This month"
                color="red"
              />
            </div>

            {/* Resource Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Database Usage</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Total Size</span>
                      <span className="font-semibold text-gray-900">{mockMetrics.databaseSize}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Growth rate: +0.5 GB/day</p>
                    <p>Projected full: 180 days</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Storage Usage</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Total Used</span>
                      <span className="font-semibold text-gray-900">{mockMetrics.storageUsed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Growth rate: +2.3 GB/day</p>
                    <p>Projected full: 90 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">System Health</h3>
              <div className="space-y-4">
                <HealthItem label="Database Connection" status="healthy" />
                <HealthItem label="Cache Service" status="healthy" />
                <HealthItem label="Email Service" status="healthy" />
                <HealthItem label="File Storage" status="warning" />
                <HealthItem label="LLM API Connection" status="healthy" />
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Sarah Johnson</td>
                    <td className="px-6 py-4 text-sm text-gray-600">sarah@firm.com</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        Admin
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="text-blue-600 hover:underline">Edit</button>
                      <button className="text-red-600 hover:underline">Disable</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Michael Chen</td>
                    <td className="px-6 py-4 text-sm text-gray-600">michael@firm.com</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        Lawyer
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="text-blue-600 hover:underline">Edit</button>
                      <button className="text-red-600 hover:underline">Disable</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            {mockLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <strong>{log.user}</strong> ({log.email})
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{log.action}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{log.timestamp}</span>
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {log.status === 'success' ? '✓ Success' : '✗ Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">System Settings</h3>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h4 className="font-semibold text-gray-900 mb-4">API Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      API Rate Limit (requests/minute)
                    </label>
                    <input
                      type="number"
                      defaultValue="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Document Size (MB)
                    </label>
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Email Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      SMTP Server
                    </label>
                    <input
                      type="text"
                      defaultValue="smtp.gmail.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      From Email
                    </label>
                    <input
                      type="email"
                      defaultValue="noreply@legalassistant.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Backup & Recovery</h4>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Backup Database
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    View Backups
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                  Save Changes
                </button>
                <button className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MetricBoxProps {
  label: string;
  value: string | number;
  subtext: string;
  color: 'blue' | 'green' | 'purple' | 'red';
}

const MetricBox: React.FC<MetricBoxProps> = ({ label, value, subtext, color }) => {
  const colors = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    purple: 'border-purple-200 bg-purple-50',
    red: 'border-red-200 bg-red-50',
  };

  return (
    <div className={`${colors[color]} border rounded-lg p-6`}>
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600 mt-2">{subtext}</p>
    </div>
  );
};

interface HealthItemProps {
  label: string;
  status: 'healthy' | 'warning' | 'critical';
}

const HealthItem: React.FC<HealthItemProps> = ({ label, status }) => {
  const colors = {
    healthy: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
  };

  const labels = {
    healthy: '✓ Healthy',
    warning: '⚠️ Warning',
    critical: '✗ Critical',
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <span className="font-semibold text-gray-900">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status]}`}>
        {labels[status]}
      </span>
    </div>
  );
};

export default AdminDashboard;
