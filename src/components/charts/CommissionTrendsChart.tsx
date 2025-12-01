/**
 * Commission Trends Chart with Forecast
 * Shows last 6 months of commission data + 3-month forecast
 */

'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface CommissionData {
  month_year: string;
  month_name: string;
  total_commissions: number;
  total_revenue?: number;
  trade_count?: number;
  client_count?: number;
  commission_growth_pct?: number | string | null;
  is_forecast?: boolean;
}

interface CommissionTrendsData {
  historical: CommissionData[];
  forecast: CommissionData[];
}

interface Props {
  partnerId: string | null;
  showForecast?: boolean;
}

export function CommissionTrendsChart({ partnerId, showForecast = true }: Props) {
  const [data, setData] = useState<CommissionTrendsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!partnerId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:8001/api/index.php?endpoint=cubes&cube=commission_trends&partner_id=${partnerId}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError('Failed to load commission trends');
        }
      } catch (err) {
        console.error('Error fetching commission trends:', err);
        setError('Network error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [partnerId]);

  if (!partnerId) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            Select a partner to view commission trends and forecast
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">
            ❌ {error || 'No data available'}
          </p>
        </div>
      </Card>
    );
  }

  // Combine historical and forecast for chart
  const chartData = [
    ...data.historical.map((d) => ({
      ...d,
      label: d.month_name.substring(0, 3),
      actualCommissions: d.total_commissions,
      forecastCommissions: null,
    })),
    ...(showForecast ? data.forecast.map((d) => ({
      ...d,
      label: d.month_name.substring(0, 3),
      actualCommissions: null,
      forecastCommissions: d.total_commissions,
    })) : []),
  ];

  // Find max value for Y-axis
  const maxValue = Math.max(
    ...chartData.map((d) => d.actualCommissions || d.forecastCommissions || 0)
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isForecast = data.is_forecast;

      return (
        <div className="bg-white dark:bg-[#151717] border border-[#D6DADB] dark:border-[#323738] rounded-lg shadow-lg p-3">
          <p className="font-semibold text-[#333333] dark:text-white mb-2">
            {data.month_name} {data.month_year.split('-')[0]}
            {isForecast && <span className="ml-2 text-xs bg-[#377CFC]/10 text-[#377CFC] px-2 py-1 rounded">Forecast</span>}
          </p>
          <p className="text-sm text-[#333333] dark:text-[#C2C2C2]">
            <strong>Commission:</strong> ${(data.actualCommissions || data.forecastCommissions).toLocaleString()}
          </p>
          {!isForecast && (
            <>
              {data.trade_count && (
                <p className="text-sm text-[#6E6E6E] dark:text-[#C2C2C2]">
                  Trades: {data.trade_count.toLocaleString()}
                </p>
              )}
              {data.client_count && (
                <p className="text-sm text-[#6E6E6E] dark:text-[#C2C2C2]">
                  Clients: {data.client_count.toLocaleString()}
                </p>
              )}
              {data.commission_growth_pct != null && (
                <p className={`text-sm font-semibold ${Number(data.commission_growth_pct) >= 0 ? 'text-[#4BB4B3]' : 'text-[#EC3F3F]'}`}>
                  Growth: {Number(data.commission_growth_pct) > 0 ? '+' : ''}{Number(data.commission_growth_pct).toFixed(1)}%
                </p>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-xl font-bold text-[#333333] dark:text-white mb-4">
        📊 Commission Trend ({showForecast ? 'Last 6 Months + 3-Month Forecast' : 'Last 6 Months'})
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D6DADB" className="dark:stroke-[#323738]" opacity={0.5} />
            <XAxis
              dataKey="label"
              stroke="#6E6E6E"
              className="dark:stroke-[#C2C2C2]"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6E6E6E"
              className="dark:stroke-[#C2C2C2]"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
              }}
            />
            
            {/* Vertical line separating historical and forecast */}
            {showForecast && data.historical.length > 0 && data.forecast.length > 0 && (
              <ReferenceLine
                x={chartData[data.historical.length - 1].label}
                stroke="#6E6E6E"
                strokeDasharray="5 5"
                label={{
                  value: 'Forecast →',
                  position: 'top',
                  fill: '#6E6E6E',
                  fontSize: 12,
                }}
              />
            )}

            {/* Historical data line - Deriv Red */}
            <Line
              type="monotone"
              dataKey="actualCommissions"
              stroke="#FF444F"
              strokeWidth={3}
              dot={{ fill: '#FF444F', r: 5 }}
              activeDot={{ r: 7 }}
              name="Actual"
              connectNulls={false}
            />

            {/* Forecast data line - Deriv Blue */}
            {showForecast && (
              <Line
                type="monotone"
                dataKey="forecastCommissions"
                stroke="#377CFC"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#377CFC', r: 5 }}
                activeDot={{ r: 7 }}
                name="Forecast"
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      {data.historical.length > 0 && (
        <div className={`mt-6 grid grid-cols-1 ${showForecast ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 pt-4 border-t border-[#D6DADB] dark:border-[#323738]`}>
          <div>
            <p className="text-sm text-[#6E6E6E] dark:text-[#C2C2C2]">Average (Last 6 Months)</p>
            <p className="text-lg font-bold text-[#333333] dark:text-white">
              ${(data.historical.reduce((sum, d) => sum + d.total_commissions, 0) / data.historical.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#6E6E6E] dark:text-[#C2C2C2]">Best Month</p>
            <p className="text-lg font-bold text-[#4BB4B3]">
              ${Math.max(...data.historical.map(d => d.total_commissions)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          {showForecast && (
            <div>
              <p className="text-sm text-[#6E6E6E] dark:text-[#C2C2C2]">Forecast Average</p>
              <p className="text-lg font-bold text-[#377CFC]">
                ${data.forecast.length > 0 ? (data.forecast.reduce((sum, d) => sum + d.total_commissions, 0) / data.forecast.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

