/**
 * PrintLayout Component
 * Print-optimized layout wrapper for PDF generation
 */

'use client';

import { ReactNode } from 'react';

interface PrintLayoutProps {
  children: ReactNode;
}

export function PrintLayout({ children }: PrintLayoutProps) {
  return (
    <div className="print-layout bg-white text-gray-900">
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .page-break-after {
            page-break-after: always;
            break-after: page;
          }
          
          .page-break-before {
            page-break-before: always;
            break-before: page;
          }
          
          .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          @page {
            size: A4;
            margin: 20mm;
          }
        }

        /* Print-specific styles for screen preview */
        .print-layout {
          width: 100%;
          min-height: 100vh;
          font-family: 'IBM Plex Sans', sans-serif;
        }

        .print-layout .page-break-after {
          margin-bottom: 2rem;
        }

        /* Hide interactive elements */
        .print-layout button:not(.no-hide),
        .print-layout nav,
        .print-layout aside {
          display: none !important;
        }

        /* Optimize charts for print */
        .print-layout .recharts-wrapper {
          max-width: 100% !important;
        }

        .print-layout .recharts-surface {
          width: 100% !important;
        }
      `}</style>
      {children}
    </div>
  );
}


