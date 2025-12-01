/**
 * Print Report Page
 * Comprehensive multi-page report for PDF generation
 */

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useMetrics } from '@/hooks/useMetrics';
import { useClients } from '@/hooks/useClients';
import { useCommissions } from '@/hooks/useCommissions';
import { usePartner } from '@/hooks/usePartners';
import { PrintLayout } from '@/components/print/PrintLayout';
import { CoverPage } from '@/components/print/CoverPage';
import { formatCurrency, formatNumber, formatDate, getTierColor } from '@/lib/utils';
import { CommissionTrendsChart } from '@/components/charts/CommissionTrendsChart';
import { CommissionByPlanChart } from '@/components/charts/CommissionByPlanChart';
import { PlatformPieChart } from '@/components/charts/PlatformPieChart';
import { ClientTierChart } from '@/components/charts/ClientTierChart';
import { SignupFunnelChart } from '@/components/charts/SignupFunnelChart';
import { DemographicsGrid } from '@/components/charts/DemographicsGrid';
import { PerformanceGauge } from '@/components/charts/PerformanceGauge';
import { DailyTrendsChart } from '@/components/charts/DailyTrendsChart';
import { BadgeProgressCards } from '@/components/charts/BadgeProgressCards';

function PrintReportContent() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get('partnerId');
  
  const { data: metrics, isLoading: metricsLoading } = useMetrics(partnerId || undefined);
  const { data: clients, isLoading: clientsLoading } = useClients({ partnerId: partnerId || undefined });
  const { data: commissions, isLoading: commissionsLoading } = useCommissions(partnerId || undefined);
  const { data: partner } = usePartner(partnerId || '');

  // Wait for all data to load
  if (metricsLoading || clientsLoading || commissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-xl text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  const generatedDate = new Date();
  const partnerName = metrics?.partnerName || 'All Partners';
  const partnerTier = metrics?.partnerTier;

  return (
    <PrintLayout>
      {/* Cover Page */}
      <CoverPage
        partnerName={partnerName !== 'All partners' ? partnerName : undefined}
        partnerId={partnerId || undefined}
        generatedDate={generatedDate}
      />

      {/* Page 1: Overview & Key Metrics */}
      <div className="p-12 page-break-after">
        <h1 className="text-4xl font-bold mb-2">Executive Summary</h1>
        <p className="text-gray-600 mb-8">Performance Overview</p>

        {metrics && (
          <>
            {/* Lifetime Metrics */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Lifetime Metrics</h2>
              <div className="grid grid-cols-4 gap-6">
                <div className="border rounded-lg p-6">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-sm text-gray-600 mb-1">Commissions</div>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.ltCommissions)}</div>
                </div>
                <div className="border rounded-lg p-6">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-sm text-gray-600 mb-1">Volume Traded</div>
                  <div className="text-2xl font-bold">{formatNumber(metrics.ltVolume)}</div>
                </div>
                <div className="border rounded-lg p-6">
                  <div className="text-3xl mb-2">💵</div>
                  <div className="text-sm text-gray-600 mb-1">Deposits</div>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.ltDeposits)}</div>
                </div>
                <div className="border rounded-lg p-6">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-sm text-gray-600 mb-1">Clients</div>
                  <div className="text-2xl font-bold">{formatNumber(metrics.ltClients)}</div>
                </div>
              </div>
            </div>

            {/* Month-to-Date Metrics */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">This Month</h2>
              <div className="grid grid-cols-4 gap-6">
                <div className="border rounded-lg p-6 bg-blue-50">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-sm text-gray-600 mb-1">Commissions</div>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.mtdComm)}</div>
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded mt-2 inline-block">MTD</span>
                </div>
                <div className="border rounded-lg p-6 bg-blue-50">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-sm text-gray-600 mb-1">Volume Traded</div>
                  <div className="text-2xl font-bold">{formatNumber(metrics.mtdVolume)}</div>
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded mt-2 inline-block">MTD</span>
                </div>
                <div className="border rounded-lg p-6 bg-blue-50">
                  <div className="text-3xl mb-2">💵</div>
                  <div className="text-sm text-gray-600 mb-1">Deposits</div>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.mtdDeposits)}</div>
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded mt-2 inline-block">MTD</span>
                </div>
                <div className="border rounded-lg p-6 bg-blue-50">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-sm text-gray-600 mb-1">Clients</div>
                  <div className="text-2xl font-bold">{formatNumber(metrics.mtdClients)}</div>
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded mt-2 inline-block">MTD</span>
                </div>
              </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="avoid-break">
                <PerformanceGauge partnerId={partnerId || undefined} />
              </div>
              <div className="avoid-break">
                <DailyTrendsChart partnerId={partnerId || undefined} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Page 2: Commission Trends */}
      <div className="p-12 page-break-after">
        <h1 className="text-4xl font-bold mb-2">Commission Analysis</h1>
        <p className="text-gray-600 mb-8">Historical trends and performance</p>
        
        <div className="mb-8 avoid-break">
          <CommissionTrendsChart partnerId={partnerId} showForecast={false} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="avoid-break">
            <CommissionByPlanChart partnerId={partnerId || undefined} />
          </div>
          <div className="avoid-break">
            <PlatformPieChart partnerId={partnerId || undefined} />
          </div>
        </div>
      </div>

      {/* Page 3: Client Analytics */}
      <div className="p-12 page-break-after">
        <h1 className="text-4xl font-bold mb-2">Client Analytics</h1>
        <p className="text-gray-600 mb-8">Client demographics and performance</p>

        <div className="mb-8 avoid-break">
          <SignupFunnelChart partnerId={partnerId || undefined} />
        </div>

        <div className="mb-8 avoid-break">
          <DemographicsGrid partnerId={partnerId || undefined} />
        </div>

        <div className="avoid-break">
          <ClientTierChart clients={clients || []} isLoading={false} />
        </div>
      </div>

      {/* Page 4: Badge Progress (only for specific partners) */}
      {partnerId && partnerName !== 'All partners' && (
        <div className="p-12 page-break-after">
          <h1 className="text-4xl font-bold mb-2">Achievement Progress</h1>
          <p className="text-gray-600 mb-8">Badges and milestones</p>

          <div className="avoid-break">
            <BadgeProgressCards partnerId={partnerId} />
          </div>
        </div>
      )}

      {/* Page 5: Commission Details */}
      {commissions && commissions.length > 0 && (
        <div className="p-12 page-break-after">
          <h1 className="text-4xl font-bold mb-2">Commission Details</h1>
          <p className="text-gray-600 mb-8">Monthly commission breakdown</p>

          <div className="border rounded-lg overflow-hidden avoid-break">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.map((commission, index) => {
                  const totalCommissions = commissions.reduce((sum, c) => sum + (c.commission || 0), 0);
                  const percentage = totalCommissions > 0 ? (commission.commission / totalCommissions) * 100 : 0;
                  
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{commission.month}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-semibold">{formatCurrency(commission.commission)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm">{percentage.toFixed(1)}%</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td className="px-6 py-4 font-bold">Total</td>
                  <td className="px-6 py-4 text-right font-bold">
                    {formatCurrency(commissions.reduce((sum, c) => sum + (c.commission || 0), 0))}
                  </td>
                  <td className="px-6 py-4 text-right font-bold">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Page 6: Client List */}
      {clients && clients.length > 0 && (
        <div className="p-12">
          <h1 className="text-4xl font-bold mb-2">Client Directory</h1>
          <p className="text-gray-600 mb-8">Complete client listing</p>

          <div className="border rounded-lg overflow-hidden avoid-break">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lifetime Deposits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clients.slice(0, 50).map((client) => (
                  <tr key={client.binary_user_id}>
                    <td className="px-4 py-3">{client.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{client.binary_user_id}</td>
                    <td className="px-4 py-3">{client.country}</td>
                    <td className="px-4 py-3">
                      {client.tier && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getTierColor(client.tier)}`}>
                          {client.tier}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{formatDate(client.joinDate)}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {client.lifetimeDeposits ? formatCurrency(client.lifetimeDeposits) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clients.length > 50 && (
              <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                Showing top 50 clients of {clients.length} total
              </div>
            )}
          </div>
        </div>
      )}
    </PrintLayout>
  );
}

export default function PrintReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PrintReportContent />
    </Suspense>
  );
}


