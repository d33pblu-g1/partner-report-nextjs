/**
 * Sidebar Component
 * Main navigation sidebar
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2V10z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Clients',
    href: '/clients',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Commissions',
    href: '/commissions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 19h16M4 15l4-4 3 3 6-6" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Client Lifecycle',
    href: '/client-lifecycle',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Master Partner',
    href: '/master-partner',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l7 4v6c0 5-7 8-7 8s-7-3-7-8V7l7-4z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Events',
    href: '/events',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 3v4M8 3v4M3 11h18" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Tiers & Badges',
    href: '/tiers-badges',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l3 6 6 1-4.5 4.4L17 21l-5-2.6L7 21l1.5-6.6L4 10l6-1 2-6z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Country Analysis',
    href: '/country-analysis',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Trading Analytics',
    href: '/trading-analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 19h16M4 15l4-4 3 3 6-6 3 3" stroke="currentColor" strokeWidth="2"/>
        <circle cx="7" cy="11" r="1" fill="currentColor"/>
        <circle cx="14" cy="7" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: 'Funding Analytics',
    href: '/funding-analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Partner Links',
    href: '/partner-links',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'Database',
    href: '/database',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useStore();

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-[#151717] dark:bg-[#0E0E0E] transform transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-[#323738]',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="p-6 border-b border-[#323738]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF444F] to-[#D33636] rounded-lg flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Partner Report</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-[#FF444F] text-white shadow-md'
                    : 'text-[#C2C2C2] hover:bg-[#323738] hover:text-white'
                )}
                onClick={() => {
                  // Close sidebar on mobile after click
                  if (window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer - Country Manager Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#323738]">
          <div className="text-xs text-[#C2C2C2]">
            <a
              href="https://wa.me/971521462917"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-[#323738] rounded-lg p-2 -m-2 transition-colors group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white group-hover:text-green-400 transition-colors truncate">
                    Samiullah Naseem
                  </div>
                  <div className="mt-1 text-[#C2C2C2] group-hover:text-green-400 transition-colors">
                    +971521462917
                  </div>
                </div>
                {/* WhatsApp Icon */}
                <svg
                  className="w-6 h-6 text-green-500 group-hover:text-green-400 transition-colors flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

