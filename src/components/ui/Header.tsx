/**
 * Header Component
 * Top header with menu toggle, partner selector, and theme toggle
 */

'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { usePartners } from '@/hooks/usePartners';

export function Header() {
  const { toggleTheme, theme, selectedPartnerId, setSelectedPartnerId, isRightMenuOpen, toggleRightMenu } = useStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const { data: partners, isLoading } = usePartners();

  const handleExportReport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const url = selectedPartnerId 
        ? `/api/export-report?partnerId=${selectedPartnerId}`
        : '/api/export-report';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `partner-report-${new Date().toISOString().split('T')[0]}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      // Close menu after successful export
      toggleRightMenu();
    } catch (error) {
      console.error('Export error:', error);
      setExportError(error instanceof Error ? error.message : 'Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-[#151717] border-b border-[#D6DADB] dark:border-[#323738] px-4 py-3 flex items-center justify-between gap-4">
        {/* Center: Partner Selector */}
        <div className="flex-1 max-w-md">
          <label htmlFor="partner-selector" className="sr-only">
            Select Partner
          </label>
          {isLoading ? (
            <div className="animate-pulse bg-[#F2F3F4] dark:bg-[#323738] h-10 rounded-lg" />
          ) : (
            <select
              id="partner-selector"
              value={selectedPartnerId || ''}
              onChange={(e) => setSelectedPartnerId(e.target.value || null)}
              className="w-full px-4 py-2 bg-[#F2F3F4] dark:bg-[#0E0E0E] border border-[#D6DADB] dark:border-[#323738] rounded-lg text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF444F]/50"
            >
              <option value="">All Partners</option>
              {partners?.map((partner) => (
                <option key={partner.partner_id} value={partner.partner_id}>
                  {partner.name} ({partner.partner_id})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Right: Burger Menu Toggle */}
        <button
          onClick={toggleRightMenu}
          className="p-2 rounded-lg hover:bg-[#F2F3F4] dark:hover:bg-[#323738] transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#333333] dark:text-[#C2C2C2]">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Right Menu Panel */}
      <>
        {/* Overlay */}
        {isRightMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleRightMenu}
          />
        )}

        {/* Slide-out Panel */}
        <div
          className={`fixed top-0 right-0 z-50 h-screen w-64 bg-white dark:bg-[#151717] border-l border-[#D6DADB] dark:border-[#323738] transform transition-transform duration-300 ease-in-out ${
            isRightMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Panel Header */}
          <div className="p-4 border-b border-[#D6DADB] dark:border-[#323738] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#333333] dark:text-white">Settings</h2>
            <button
              onClick={toggleRightMenu}
              className="p-1 rounded-lg hover:bg-[#F2F3F4] dark:hover:bg-[#323738] transition-colors"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#333333] dark:text-[#C2C2C2]">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Panel Content */}
          <div className="p-4 space-y-2">
            {/* Export Report Button */}
            <button
              onClick={handleExportReport}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#F2F3F4] dark:hover:bg-[#323738] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  {isExporting ? (
                    <svg className="animate-spin h-5 w-5 text-[#333333] dark:text-[#C2C2C2]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#333333] dark:text-[#C2C2C2]">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[#333333] dark:text-white font-medium">
                  {isExporting ? 'Generating...' : 'Export Report'}
                </span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#6E6E6E] dark:text-[#C2C2C2]">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Export Error Message */}
            {exportError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs text-red-600 dark:text-red-400">{exportError}</p>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                toggleRightMenu();
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#F2F3F4] dark:hover:bg-[#323738] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-5 h-5">
                  {/* Sun icon - visible in dark mode */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`absolute inset-0 text-[#333333] dark:text-[#C2C2C2] transition-all duration-300 ${
                      theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                    }`}
                  >
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2"/>
                    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  
                  {/* Moon icon - visible in light mode */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`absolute inset-0 text-[#333333] dark:text-[#C2C2C2] transition-all duration-300 ${
                      theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
                    }`}
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <span className="text-[#333333] dark:text-white font-medium">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#6E6E6E] dark:text-[#C2C2C2]">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </>
    </>
  );
}

