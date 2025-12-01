'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  keywords: string[];
}

const navigationItems: NavigationItem[] = [
  // Financial
  {
    name: 'Commissions',
    href: '/commissions',
    description: 'View commission reports, earnings breakdown, and payment history',
    category: 'Financial',
    keywords: ['commission', 'earnings', 'payment', 'revenue', 'income'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <path d="M4 19h16M4 15l4-4 3 3 6-6" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Funding Analytics',
    href: '/funding-analytics',
    description: 'Track deposits, withdrawals, and funding patterns across clients',
    category: 'Financial',
    keywords: ['deposit', 'deposits', 'withdrawal', 'funding', 'money', 'payment', 'transaction'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  // Client Management
  {
    name: 'Clients',
    href: '/clients',
    description: 'Manage and view detailed client information and activity',
    category: 'Client Management',
    keywords: ['client', 'customer', 'user', 'account', 'member'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Client Lifecycle',
    href: '/client-lifecycle',
    description: 'Analyze client journey from signup to active trading',
    category: 'Client Management',
    keywords: ['lifecycle', 'journey', 'funnel', 'conversion', 'retention', 'signup'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Tiers & Badges',
    href: '/tiers-badges',
    description: 'View tier status, badge achievements, and progression tracking',
    category: 'Client Management',
    keywords: ['tier', 'badge', 'achievement', 'level', 'rank', 'status', 'progress'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <path d="M12 3l3 6 6 1-4.5 4.4L17 21l-5-2.6L7 21l1.5-6.6L4 10l6-1 2-6z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  // Analytics
  {
    name: 'Trading Analytics',
    href: '/trading-analytics',
    description: 'Deep dive into trading patterns, volumes, and performance metrics',
    category: 'Analytics',
    keywords: ['trading', 'trade', 'volume', 'analytics', 'performance', 'metrics'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <path d="M4 19h16M4 15l4-4 3 3 6-6 3 3" stroke="currentColor" strokeWidth="2"/>
        <circle cx="7" cy="11" r="1" fill="currentColor"/>
        <circle cx="14" cy="7" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Country Analysis',
    href: '/country-analysis',
    description: 'Geographic performance breakdown and regional insights',
    category: 'Analytics',
    keywords: ['country', 'region', 'geography', 'location', 'map', 'international'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Events',
    href: '/events',
    description: 'Track important events, milestones, and activity timeline',
    category: 'Analytics',
    keywords: ['event', 'activity', 'timeline', 'history', 'log', 'milestone'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 3v4M8 3v4M3 11h18" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  // Partner Tools
  {
    name: 'Master Partner',
    href: '/master-partner',
    description: 'Master partner dashboard and sub-partner management',
    category: 'Partner Tools',
    keywords: ['master', 'partner', 'ib', 'affiliate', 'referral', 'sub-partner'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <path d="M12 3l7 4v6c0 5-7 8-7 8s-7-3-7-8V7l7-4z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Partner Links',
    href: '/partner-links',
    description: 'Manage tracking links, referral URLs, and link performance',
    category: 'Partner Tools',
    keywords: ['link', 'url', 'tracking', 'referral', 'affiliate link', 'tracking code'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  // System
  {
    name: 'Database',
    href: '/database',
    description: 'Database management, table viewer, and system controls',
    category: 'System',
    keywords: ['database', 'table', 'data', 'system', 'admin', 'management'],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#FF444F]">
        <ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
];

export default function IndexPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on search query
  const filteredItems = navigationItems.filter((item) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );
  });

  // Group filtered items by category
  const categories = Array.from(new Set(filteredItems.map((item) => item.category)));
  const itemsByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredItems.filter((item) => item.category === category);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Quick Access Index
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find common items like deposits, commissions, clients, and analytics
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for deposits, commissions, clients, analytics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#FF444F] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Found {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Navigation Items by Category */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map((category, categoryIndex) => (
            <div key={`category-${category}-${categoryIndex}`}>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#FF444F] rounded-full"></span>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {itemsByCategory[category].map((item, itemIndex) => (
                  <Link
                    key={`${category}-${item.href}-${itemIndex}`}
                    href={item.href}
                    className={cn(
                      'group block bg-white dark:bg-gray-800 rounded-lg p-6',
                      'border border-gray-200 dark:border-gray-700',
                      'hover:border-[#FF444F] hover:shadow-lg',
                      'transition-all duration-200',
                      'hover:scale-[1.02]'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#FF444F]/10 dark:bg-[#FF444F]/20 rounded-lg flex items-center justify-center group-hover:bg-[#FF444F]/20 dark:group-hover:bg-[#FF444F]/30 transition-colors">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-[#FF444F] transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-[#FF444F] transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Tips */}
      {!searchQuery && (
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Tips
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#FF444F] mt-0.5">•</span>
              <span>Search for <strong>&quot;deposits&quot;</strong> to find Funding Analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF444F] mt-0.5">•</span>
              <span>Look for <strong>&quot;commissions&quot;</strong> to view earnings and payments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF444F] mt-0.5">•</span>
              <span>Use <strong>&quot;trading&quot;</strong> to access trading analytics and volumes</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

