'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { buildApiUrl } from '@/lib/config';

interface PartnerLink {
  commission_id: number;
  partner_id: string;
  commission_plan: string | null;
  type: string;
  target: string | null;
  language: string;
  url: string;
  landing_page: string | null;
  description: string | null;
  click_count: number;
  conversion_count: number;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  created_at: string;
  updated_at: string;
}

// Fetch partner links
async function fetchPartnerLinks(partnerId?: string | null): Promise<PartnerLink[]> {
  const url = buildApiUrl('partner_links', partnerId ? { partner_id: partnerId } : undefined);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch partner links');
  }
  const data = await response.json();
  return data.data || [];
}

// Delete partner link
async function deletePartnerLink(commissionId: number): Promise<void> {
  const url = buildApiUrl('partner_links', { commission_id: commissionId });
  
  const response = await fetch(url, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to delete partner link');
  }
}

export default function PartnerLinksPage() {
  const { selectedPartnerId } = useStore();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch partner links
  const { data: links, isLoading, error } = useQuery({
    queryKey: ['partnerLinks', selectedPartnerId],
    queryFn: () => fetchPartnerLinks(selectedPartnerId),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePartnerLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partnerLinks'] });
    },
  });

  // Filter links
  const filteredLinks = links?.filter(link => {
    const matchesSearch = 
      link.partner_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.target?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (link.commission_plan?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = 
      statusFilter === 'all' || link.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleDelete = async (commissionId: number) => {
    if (confirm('Are you sure you want to archive this link?')) {
      deleteMutation.mutate(commissionId);
    }
  };

  // Calculate stats
  const stats = {
    total: filteredLinks.length,
    active: filteredLinks.filter(l => l.status === 'active').length,
    totalClicks: filteredLinks.reduce((sum, l) => sum + l.click_count, 0),
    totalConversions: filteredLinks.reduce((sum, l) => sum + l.conversion_count, 0),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Partner Links
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track affiliate links, banners, and campaigns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Links</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {stats.active} active
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Clicks</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalClicks.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            All time
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversions</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalConversions.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Total converted
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalClicks > 0 
              ? ((stats.totalConversions / stats.totalClicks) * 100).toFixed(2)
              : '0.00'
            }%
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Average rate
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by partner, type, URL, target..."
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      {isLoading ? (
        <Card>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-16 rounded-lg" />
              </div>
            ))}
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="text-red-600 dark:text-red-400 text-center py-8">
            ❌ Failed to load partner links: {(error as Error).message}
          </div>
        </Card>
      ) : filteredLinks.length > 0 ? (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Commission ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Partner ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Commission Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Landing Page
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Conversions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLinks.map((link) => (
                  <tr key={link.commission_id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        #{link.commission_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {link.partner_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {link.commission_plan || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {link.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {link.target || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white uppercase">
                        {link.language}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline max-w-xs truncate block"
                        title={link.url}
                      >
                        {link.url.length > 50 ? link.url.substring(0, 50) + '...' : link.url}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {link.landing_page ? (
                        <a
                          href={link.landing_page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline max-w-xs truncate block"
                          title={link.landing_page}
                        >
                          {link.landing_page.length > 40 ? link.landing_page.substring(0, 40) + '...' : link.landing_page}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {link.click_count.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">
                        {link.conversion_count.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        link.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        link.status === 'inactive' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' :
                        link.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {link.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(link.commission_id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                        title="Archive link"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No links found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No partner links available'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
