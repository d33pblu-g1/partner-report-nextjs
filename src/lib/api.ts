/**
 * API Client Library
 * Handles all communication with the PHP backend
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  Partner,
  Client,
  PartnerMetrics,
  CommissionData,
  PartnerLink,
  MonthlyDepositsCube,
  PartnerScorecardCube,
  FilterOptions,
  PartnerInsight,
  PartnerRecommendation,
  AffiliateTip,
} from '@/types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Unknown error';
    const endpoint = error.config?.url || 'unknown endpoint';
    
    // Suppress expected errors for endpoints that may not exist yet
    const isExpectedMissing = 
      endpoint.includes('endpoint=tips') || 
      endpoint.includes('endpoint=cubes') ||
      errorMessage.includes('Endpoint not found');
    
    if (isExpectedMissing) {
      // Just a warning for expected missing endpoints
      console.warn(`⚠️ API endpoint not yet implemented [${endpoint}]:`, errorMessage);
    } else {
      // Log as error for unexpected issues
      console.error(`❌ API Response Error [${endpoint}]:`, errorMessage);
      
      // Don't log empty objects
      if (error.response?.data && Object.keys(error.response.data).length > 0) {
        console.error('Error details:', error.response.data);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic API request helper
 */
async function apiRequest<T>(
  endpoint: string,
  options?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      url: `/index.php?endpoint=${endpoint}`,
      ...options,
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.message);
    }
    throw error;
  }
}

// ============================================================================
// Partners API
// ============================================================================

export async function getPartners(): Promise<Partner[]> {
  return apiRequest<Partner[]>('partners');
}

export async function getPartner(partnerId: string): Promise<Partner> {
  const response = await apiRequest<Partner[]>(`partners&partner_id=${partnerId}`);
  // PHP API returns an array even for single partner query, so extract first element
  if (Array.isArray(response) && response.length > 0) {
    return response[0];
  }
  throw new Error('Partner not found');
}

// ============================================================================
// Clients API
// ============================================================================

export async function getClients(filters?: FilterOptions): Promise<Client[]> {
  const params = new URLSearchParams();
  
  if (filters?.partnerId) params.append('partner_id', filters.partnerId);
  if (filters?.country) params.append('country', filters.country);
  if (filters?.tier) params.append('tier', filters.tier);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());
  
  const queryString = params.toString();
  const endpoint = queryString ? `clients&${queryString}` : 'clients';
  
  const response = await apiRequest<{ clients: Client[]; total: number; limit: number; offset: number }>(endpoint);
  return response.clients;
}

export async function getClient(clientId: string): Promise<Client> {
  return apiRequest<Client>(`clients&id=${clientId}`);
}

export async function createClient(client: Partial<Client>): Promise<Client> {
  return apiRequest<Client>('clients', {
    method: 'POST',
    data: client,
  });
}

export async function updateClient(clientId: string, client: Partial<Client>): Promise<Client> {
  return apiRequest<Client>(`clients&id=${clientId}`, {
    method: 'PUT',
    data: client,
  });
}

export async function deleteClient(clientId: string): Promise<void> {
  return apiRequest<void>(`clients&id=${clientId}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// Metrics API
// ============================================================================

export async function getMetrics(partnerId?: string): Promise<PartnerMetrics> {
  const endpoint = partnerId ? `metrics&partner_id=${partnerId}` : 'metrics';
  return apiRequest<PartnerMetrics>(endpoint);
}

// ============================================================================
// Commissions API
// ============================================================================

export async function getCommissions(partnerId?: string): Promise<CommissionData[]> {
  const endpoint = partnerId ? `commissions&partner_id=${partnerId}` : 'commissions';
  return apiRequest<CommissionData[]>(endpoint);
}

// ============================================================================
// Cubes API
// ============================================================================

export async function getCubeData<T = any>(
  cubeName: string,
  partnerId?: string
): Promise<T> {
  try {
    const endpoint = partnerId 
      ? `cubes&cube=${cubeName}&partner_id=${partnerId}`
      : `cubes&cube=${cubeName}`;
    return await apiRequest<T>(endpoint);
  } catch (error) {
    console.warn(`⚠️ Cube data not available for: ${cubeName}. Returning empty array.`);
    // Return empty array for missing cubes instead of throwing
    return [] as T;
  }
}

export async function getMonthlyDeposits(partnerId?: string): Promise<MonthlyDepositsCube[]> {
  return getCubeData<MonthlyDepositsCube[]>('monthly_deposits', partnerId);
}

export async function getPartnerScorecard(partnerId?: string): Promise<PartnerScorecardCube | PartnerScorecardCube[]> {
  return getCubeData<PartnerScorecardCube | PartnerScorecardCube[]>('partner_scorecard', partnerId);
}

// ============================================================================
// Partner Links API
// ============================================================================

export async function getPartnerLinks(partnerId?: string): Promise<PartnerLink[]> {
  const endpoint = partnerId ? `partner_links&partner_id=${partnerId}` : 'partner_links';
  return apiRequest<PartnerLink[]>(endpoint);
}

export async function createPartnerLink(link: Omit<PartnerLink, 'id' | 'created_at' | 'updated_at'>): Promise<PartnerLink> {
  return apiRequest<PartnerLink>('partner_links', {
    method: 'POST',
    data: link,
  });
}

export async function deletePartnerLink(linkId: number): Promise<void> {
  return apiRequest<void>(`partner_links&id=${linkId}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// Charts API
// ============================================================================

export async function getChartData(chartType: string, partnerId?: string): Promise<any> {
  const endpoint = partnerId 
    ? `charts&type=${chartType}&partner_id=${partnerId}`
    : `charts&type=${chartType}`;
  return apiRequest<any>(endpoint);
}

// ============================================================================
// Partner Insights & Recommendations API
// ============================================================================

export async function getInsights(partnerId: string): Promise<PartnerInsight[]> {
  return apiRequest<PartnerInsight[]>(`insights&partner_id=${partnerId}`);
}

export async function getRecommendations(partnerId: string): Promise<PartnerRecommendation[]> {
  return apiRequest<PartnerRecommendation[]>(`recommendations&partner_id=${partnerId}`);
}

// ============================================================================
// Affiliate Tips API
// ============================================================================

export async function getRandomTip(): Promise<AffiliateTip> {
  try {
    return await apiRequest<AffiliateTip>('tips');
  } catch (error) {
    // If tips endpoint doesn't exist, return a default tip
    console.warn('⚠️ Tips endpoint not available. Using default tip.');
    return {
      id: 0,
      tip_text: 'Focus on building trust before selling. Share educational content about forex trading to establish yourself as an authority in the space.',
      category: 'marketing',
      created_at: new Date().toISOString(),
      is_active: true,
    } as AffiliateTip;
  }
}

// ============================================================================
// Health Check
// ============================================================================

export async function checkApiHealth(): Promise<boolean> {
  try {
    await getPartners();
    return true;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return false;
  }
}

// ============================================================================
// Export all API functions
// ============================================================================

const api = {
  // Partners
  getPartners,
  getPartner,
  
  // Clients
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  
  // Metrics
  getMetrics,
  
  // Commissions
  getCommissions,
  
  // Cubes
  getCubeData,
  getMonthlyDeposits,
  getPartnerScorecard,
  
  // Partner Links
  getPartnerLinks,
  createPartnerLink,
  deletePartnerLink,
  
  // Insights & Recommendations
  getInsights,
  getRecommendations,
  
  // Affiliate Tips
  getRandomTip,
  
  // Charts
  getChartData,
  
  // Health
  checkApiHealth,
};

export default api;

