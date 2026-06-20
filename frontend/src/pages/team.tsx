/**
 * Team Collaboration Page
 * Real-time document sharing and team management
 */

'use client';

import React, { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'lawyer' | 'paralegal' | 'viewer';
  joinedDate: string;
  status: 'active' | 'inactive';
  avatar: string;
}

interface SharedDocument {
  id: string;
  title: string;
  sharedWith: string[];
  sharedDate: string;
  permissions: 'view' | 'comment' | 'edit';
  status: 'shared' | 'pending';
}

interface Activity {
  id: string;
  type: 'shared' | 'viewed' | 'commented' | 'analyzed';
  user: string;
  document: string;
  timestamp: string;
  details: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@firm.com',
    role: 'admin',
    joinedDate: '2024-01-15',
    status: 'active',
    avatar: '👩‍⚖️',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@firm.com',
    role: 'lawyer',
    joinedDate: '2024-02-20',
    status: 'active',
    avatar: '👨‍⚖️',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@firm.com',
    role: 'paralegal',
    joinedDate: '2024-03-10',
    status: 'active',
    avatar: '👩‍💼',
  },
];

const mockSharedDocuments: SharedDocument[] = [
  {
    id: '1',
    title: 'Q4 Service Agreement',
    sharedWith: ['michael@firm.com', 'emily@firm.com'],
    sharedDate: '2024-06-15',
    permissions: 'comment',
    status: 'shared',
  },
  {
    id: '2',
    title: 'Contract Amendment',
    sharedWith: ['sarah@firm.com'],
    sharedDate: '2024-06-10',
    permissions: 'view',
    status: 'pending',
  },
];

const mockActivity: Activity[] = [
  {
    id: '1',
    type: 'shared',
    user: 'Sarah Johnson',
    document: 'Q4 Service Agreement',
    timestamp: '2 hours ago',
    details: 'shared with Michael Chen',
  },
  {
    id: '2',
    type: 'commented',
    user: 'Michael Chen',
    document: 'Q4 Service Agreement',
    timestamp: '1 hour ago',
    details: 'added comment on risk section',
  },
  {
    id: '3',
    type: 'analyzed',
    user: 'Emily Rodriguez',
    document: 'Contract Amendment',
    timestamp: '30 minutes ago',
    details: 'completed risk analysis',
  },
];

export const TeamCollaborationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('lawyer');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-purple-100 text-purple-800',
      lawyer: 'bg-blue-100 text-blue-800',
      paralegal: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
          <p className="text-gray-600 mt-2">Manage team members and document sharing</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'members'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Team Members ({mockTeamMembers.length})
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'shared'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Shared Documents ({mockSharedDocuments.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-4 px-2 font-semibold border-b-2 transition ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                + Invite Team Member
              </button>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 w-full max-w-md">
                  <h2 className="text-2xl font-bold mb-6">Invite Team Member</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="name@firm.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      >
                        <option value="lawyer">Lawyer</option>
                        <option value="paralegal">Paralegal</option>
                        <option value="manager">Manager</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={() => setShowInviteModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setShowInviteModal(false);
                          setInviteEmail('');
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Send Invite
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTeamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-3xl mb-2">{member.avatar}</div>
                      <h3 className="font-bold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(member.role)}`}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                        <span
                          className={`w-3 h-3 rounded-full ${
                            member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Joined {new Date(member.joinedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shared Documents Tab */}
        {activeTab === 'shared' && (
          <div className="space-y-4">
            {mockSharedDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Shared with {doc.sharedWith.length} member{doc.sharedWith.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {doc.sharedWith.map((email, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {email}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        doc.status === 'shared'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {doc.status === 'shared' ? '✓ Shared' : '⏳ Pending'}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(doc.sharedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            {mockActivity.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <strong>{activity.user}</strong>{' '}
                      <span className="text-gray-600">
                        {activity.type === 'shared' && 'shared'}
                        {activity.type === 'viewed' && 'viewed'}
                        {activity.type === 'commented' && 'commented on'}
                        {activity.type === 'analyzed' && 'analyzed'}
                      </span>{' '}
                      <strong>{activity.document}</strong>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCollaborationPage;
