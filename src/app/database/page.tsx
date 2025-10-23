'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TableInfo {
  table_name: string;
  row_count: number;
  created_at?: string;
  updated_at?: string;
}

interface ServiceStatus {
  mysql: 'running' | 'stopped' | 'unknown';
  php: 'running' | 'stopped' | 'unknown';
  nextjs: 'running';
}

interface TableData {
  columns: string[];
  rows: any[];
}

export default function DatabasePage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    mysql: 'unknown',
    php: 'unknown',
    nextjs: 'running',
  });
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isLoadingTableData, setIsLoadingTableData] = useState(false);

  useEffect(() => {
    fetchTables();
    checkServiceStatus();
  }, []);

  const fetchTables = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8001/api/index.php?endpoint=all_tables');
      const data = await response.json();
      
      if (data.success) {
        setTables(data.data || []);
        setServiceStatus(prev => ({ ...prev, mysql: 'running', php: 'running' }));
      } else {
        setError(data.message || 'Failed to load tables');
        setServiceStatus(prev => ({ ...prev, mysql: 'unknown', php: 'stopped' }));
      }
    } catch (err) {
      setError('Network error: Could not connect to API server');
      setServiceStatus(prev => ({ ...prev, php: 'stopped' }));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkServiceStatus = async () => {
    // Check PHP API
    try {
      const response = await fetch('http://localhost:8001/api/index.php?endpoint=partners');
      if (response.ok) {
        setServiceStatus(prev => ({ ...prev, php: 'running' }));
      } else {
        setServiceStatus(prev => ({ ...prev, php: 'stopped' }));
      }
    } catch {
      setServiceStatus(prev => ({ ...prev, php: 'stopped' }));
    }

    // MySQL status is checked via the tables fetch
  };

  const fetchTableData = async (tableName: string) => {
    setIsLoadingTableData(true);
    setSelectedTable(tableName);
    setTableData(null);
    
    try {
      const response = await fetch(`http://localhost:8001/api/index.php?endpoint=table_data&table=${tableName}&limit=100`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const rows = data.data;
        if (rows.length > 0) {
          const columns = Object.keys(rows[0]);
          setTableData({ columns, rows });
        } else {
          setTableData({ columns: [], rows: [] });
        }
      } else {
        setError('Failed to load table data');
      }
    } catch (err) {
      console.error('Error fetching table data:', err);
      setError('Failed to fetch table data');
    } finally {
      setIsLoadingTableData(false);
    }
  };

  const closeModal = () => {
    setSelectedTable(null);
    setTableData(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'stopped':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return '✅';
      case 'stopped':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Database Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View database tables and service status
        </p>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* MySQL Status */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">MySQL Database</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getStatusIcon(serviceStatus.mysql)}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(serviceStatus.mysql)}`}>
                  {serviceStatus.mysql.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-4xl">🗄️</div>
          </div>
        </Card>

        {/* PHP API Status */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">PHP API Server</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getStatusIcon(serviceStatus.php)}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(serviceStatus.php)}`}>
                  {serviceStatus.php.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-4xl">🐘</div>
          </div>
        </Card>

        {/* Next.js Status */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next.js App</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getStatusIcon(serviceStatus.nextjs)}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(serviceStatus.nextjs)}`}>
                  RUNNING
                </span>
              </div>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </Card>
      </div>

      {/* Refresh Button */}
      <div className="mb-6 flex gap-4">
        <Button onClick={fetchTables} isLoading={isLoading}>
          🔄 Refresh Tables
        </Button>
        <Button onClick={checkServiceStatus} variant="secondary">
          🔍 Check Service Status
        </Button>
      </div>

      {/* Loading State */}
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
        /* Error State */
        <Card>
          <div className="text-center py-12">
            <div className="text-red-600 dark:text-red-400 mb-4 text-5xl">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Database Connection Error
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 text-left max-w-md mx-auto">
              <p><strong>Troubleshooting:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure MySQL is running: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">brew services start mysql</code></li>
                <li>Ensure PHP API is running on port 8001</li>
                <li>Check database credentials in config.php</li>
              </ul>
            </div>
            <Button onClick={fetchTables} className="mt-6">
              Retry Connection
            </Button>
          </div>
        </Card>
      ) : tables.length > 0 ? (
        /* Tables and Cubes */
        <>
          {/* Core Database Tables Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              📋 Core Tables
            </h2>
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Table Name
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Row Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tables
                      .filter((table) => !table.table_name.startsWith('cube_'))
                      .map((table) => (
                        <tr 
                          key={table.table_name} 
                          onClick={() => fetchTableData(table.table_name)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">📋</span>
                              <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {table.table_name}
                                </div>
                                {table.created_at && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Created: {new Date(table.created_at).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {table.row_count.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              rows
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                        Total Core Tables
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white text-right">
                        {tables
                          .filter((table) => !table.table_name.startsWith('cube_'))
                          .reduce((sum, t) => sum + t.row_count, 0)
                          .toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                        {tables.filter((table) => !table.table_name.startsWith('cube_')).length} tables
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </div>

          {/* Data Cubes Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🔷 Data Cubes (Pre-Aggregated Analytics)
            </h2>
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cube Name
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Row Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {tables
                      .filter((table) => table.table_name.startsWith('cube_'))
                      .map((table) => (
                        <tr 
                          key={table.table_name}
                          onClick={() => fetchTableData(table.table_name)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">🔷</span>
                              <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {table.table_name}
                                </div>
                                {table.updated_at && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Updated: {new Date(table.updated_at).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {table.row_count.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              rows
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              Cube
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                        Total Data Cubes
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white text-right">
                        {tables
                          .filter((table) => table.table_name.startsWith('cube_'))
                          .reduce((sum, t) => sum + t.row_count, 0)
                          .toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                        {tables.filter((table) => table.table_name.startsWith('cube_')).length} cubes
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </div>
        </>
      ) : (
        /* No Data State */
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tables found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Database is empty or not accessible
            </p>
          </div>
        </Card>
      )}

      {/* Table Data Modal */}
      {selectedTable && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTable}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Showing first 100 rows
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-600 dark:text-gray-400">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6">
              {isLoadingTableData ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : tableData && tableData.rows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                      <tr>
                        {tableData.columns.map((column) => (
                          <th 
                            key={column}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {tableData.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          {tableData.columns.map((column) => (
                            <td 
                              key={column}
                              className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white"
                            >
                              {row[column] !== null && row[column] !== undefined
                                ? String(row[column]).length > 50
                                  ? String(row[column]).substring(0, 50) + '...'
                                  : String(row[column])
                                : <span className="text-gray-400 italic">null</span>
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : tableData && tableData.rows.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    This table is empty
                  </p>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            {tableData && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Showing {tableData.rows.length} rows
                  </span>
                  <Button onClick={closeModal} variant="secondary">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

