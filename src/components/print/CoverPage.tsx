/**
 * CoverPage Component
 * Professional cover page for PDF reports
 */

'use client';

import { format } from 'date-fns';

interface CoverPageProps {
  partnerName?: string;
  partnerId?: string;
  generatedDate: Date;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function CoverPage({ partnerName, partnerId, generatedDate, dateRange }: CoverPageProps) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0E0E0E] to-[#151717] text-white p-12 page-break-after">
      {/* Deriv Logo */}
      <div className="mb-12">
        <div className="w-24 h-24 bg-gradient-to-br from-[#FF444F] to-[#D33636] rounded-2xl flex items-center justify-center shadow-2xl">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-6xl font-bold mb-4 text-center">
        Partner Performance Report
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-gray-300 mb-12 text-center max-w-2xl">
        Comprehensive Analytics & Insights Dashboard
      </p>

      {/* Partner Information */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 min-w-[500px] border border-white/20">
        {partnerName && (
          <div className="mb-4">
            <div className="text-sm text-gray-400 uppercase tracking-wide mb-1">Partner</div>
            <div className="text-2xl font-semibold">{partnerName}</div>
          </div>
        )}
        
        {partnerId && (
          <div className="mb-4">
            <div className="text-sm text-gray-400 uppercase tracking-wide mb-1">Partner ID</div>
            <div className="text-xl font-mono">{partnerId}</div>
          </div>
        )}

        <div className="mb-4">
          <div className="text-sm text-gray-400 uppercase tracking-wide mb-1">Report Generated</div>
          <div className="text-xl">{format(generatedDate, 'MMMM dd, yyyy')}</div>
          <div className="text-sm text-gray-400">{format(generatedDate, 'hh:mm a')}</div>
        </div>

        {dateRange && (
          <div>
            <div className="text-sm text-gray-400 uppercase tracking-wide mb-1">Date Range</div>
            <div className="text-xl">
              {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
            </div>
          </div>
        )}
      </div>

      {/* Report Sections Preview */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 max-w-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FF444F] rounded-full"></div>
          <span>Client Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FF444F] rounded-full"></div>
          <span>Commission Insights</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FF444F] rounded-full"></div>
          <span>Client Lifecycle</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FF444F] rounded-full"></div>
          <span>Trading Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FF444F] rounded-full"></div>
          <span>Funding Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#FF444F] rounded-full"></div>
          <span>Country Analysis</span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-12 text-center">
        <div className="text-sm text-gray-400">
          Powered by Deriv Partner Analytics Platform
        </div>
      </div>
    </div>
  );
}


