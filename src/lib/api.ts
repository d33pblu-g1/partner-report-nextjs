/**
 * API Client Library - Supabase Version
 * Replaces PHP backend with Supabase PostgreSQL + Auto-generated API
 */

import { supabase } from './supabase';
import type {
  Partner,
  Client,
  PartnerMetrics,
  CommissionData,
  PartnerLink,
  FilterOptions,
  PartnerInsight,
  PartnerRecommendation,
  AffiliateTip,
} from '@/types';

// ============================================================================
// Partners API
// ============================================================================

export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('global_rank', { ascending: true });
  
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getPartner(partnerId: string): Promise<Partner> {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('partner_id', partnerId)
    .single();
  
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Partner not found');
  return data;
}

// ============================================================================
// Clients API
// ============================================================================

export async function getClients(filters?: FilterOptions): Promise<Client[]> {
  let query = supabase.from('clients').select('*');
  
  if (filters?.partnerId) {
    query = query.eq('partner_id', filters.partnerId);
  }
  if (filters?.country) {
    query = query.eq('country', filters.country);
  }
  if (filters?.tier) {
    query = query.eq('tier', filters.tier);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }
  
  const { data, error } = await query.order('signup_date', { ascending: false });
  
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getClient(clientId: string): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('client_id', clientId)
    .single();
  
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Client not found');
  return data;
}

export async function createClient(client: Partial<Client>): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create client');
  return data;
}

export async function updateClient(clientId: string, client: Partial<Client>): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(client)
    .eq('client_id', clientId)
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to update client');
  return data;
}

export async function deleteClient(clientId: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('client_id', clientId);
  
  if (error) throw new Error(error.message);
}

// ============================================================================
// Metrics API
// ============================================================================

export async function getMetrics(partnerId?: string): Promise<PartnerMetrics> {
  try {
    // Get total commissions
    let commissionsQuery = supabase
      .from('commissions')
      .select('amount');
    
    if (partnerId) {
      commissionsQuery = commissionsQuery.eq('partner_id', partnerId);
    }
    
    const { data: commissions, error: commissionsError } = await commissionsQuery;
    
    if (commissionsError) throw commissionsError;
    
    const totalCommissions = commissions?.reduce((sum, c) => sum + (Number(c.amount) || 0), 0) || 0;
    
    // Get total clients
    let clientsQuery = supabase
      .from('clients')
      .select('client_id', { count: 'exact' });
    
    if (partnerId) {
      clientsQuery = clientsQuery.eq('partner_id', partnerId);
    }
    
    const { count: totalClients } = await clientsQuery;
    
    // Get total deposits
    let depositsQuery = supabase
      .from('deposits')
      .select('amount');
    
    if (partnerId) {
      depositsQuery = depositsQuery.eq('partner_id', partnerId);
    }
    
    const { data: deposits } = await depositsQuery;
    const totalDeposits = deposits?.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) || 0;
    
    // Get total volume
    let tradesQuery = supabase
      .from('trades')
      .select('volume');
    
    if (partnerId) {
      tradesQuery = tradesQuery.eq('partner_id', partnerId);
    }
    
    const { data: trades } = await tradesQuery;
    const totalVolume = trades?.reduce((sum, t) => sum + (Number(t.volume) || 0), 0) || 0;
    
    // Get MTD (Month To Date) metrics
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    let mtdCommissionsQuery = supabase
      .from('commissions')
      .select('amount')
      .gte('date', startOfMonth.toISOString());
    
    if (partnerId) {
      mtdCommissionsQuery = mtdCommissionsQuery.eq('partner_id', partnerId);
    }
    
    const { data: mtdCommissionsData } = await mtdCommissionsQuery;
    const mtdCommissions = mtdCommissionsData?.reduce((sum, c) => sum + (Number(c.amount) || 0), 0) || 0;
    
    return {
      partnerName: '',
      partnerTier: '',
      ltClients: totalClients || 0,
      ltDeposits: totalDeposits,
      ltCommissions: totalCommissions,
      ltVolume: totalVolume,
      mtdClients: 0,
      mtdDeposits: 0,
      mtdComm: mtdCommissions,
      mtdVolume: 0,
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    // Return default metrics on error
    return {
      partnerName: '',
      partnerTier: '',
      ltClients: 0,
      ltDeposits: 0,
      ltCommissions: 0,
      ltVolume: 0,
      mtdClients: 0,
      mtdDeposits: 0,
      mtdComm: 0,
      mtdVolume: 0,
    };
  }
}

// ============================================================================
// Commissions API
// ============================================================================

export async function getCommissions(partnerId?: string): Promise<CommissionData[]> {
  let query = supabase
    .from('commissions')
    .select('*');
  
  if (partnerId) {
    query = query.eq('partner_id', partnerId);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  
  if (error) throw new Error(error.message);
  return data || [];
}

// ============================================================================
// Cubes API (Complex queries - using database functions)
// ============================================================================

export async function getCubeData<T = any>(
  cubeName: string,
  partnerId?: string
): Promise<T> {
  try {
    const tableName = `cube_${cubeName}`;
    
    let query = supabase
      .from(tableName)
      .select('*');
    
    // Filter by partner_id if provided
    if (partnerId) {
      query = query.eq('partner_id', partnerId);
    }
    
    // Order by date or id for time-series data
    if (cubeName.includes('daily') || cubeName.includes('monthly')) {
      query = query.order('date', { ascending: false });
    } else {
      query = query.order('id', { ascending: false });
    }
    
    // Limit results to prevent overload
    query = query.limit(1000);
    
    const { data, error } = await query;
    
    if (error) {
      console.warn(`⚠️ Cube data error for ${cubeName}:`, error.message);
      return [] as T;
    }
    
    return (data || []) as T;
  } catch (error) {
    console.warn(`⚠️ Cube data not available for: ${cubeName}`);
    return [] as T;
  }
}

export async function getMonthlyDeposits(partnerId?: string): Promise<any[]> {
  return getCubeData<any[]>('monthly_deposits', partnerId);
}

export async function getPartnerScorecard(partnerId?: string): Promise<any> {
  // Use the PostgreSQL function we created
  try {
    if (partnerId) {
      const { data, error } = await supabase.rpc('get_partner_scorecard', {
        p_partner_id: partnerId
      });
      
      if (error) throw error;
      return data;
    }
    return null;
  } catch (error) {
    console.warn('⚠️ Partner scorecard not available');
    return null;
  }
}

// ============================================================================
// Partner Links API
// ============================================================================

export async function getPartnerLinks(partnerId?: string): Promise<PartnerLink[]> {
  let query = supabase
    .from('partner_links')
    .select('*');
  
  if (partnerId) {
    query = query.eq('partner_id', partnerId);
  }
  
  const { data, error } = await query
    .eq('is_active', true)
    .order('created_date', { ascending: false });
  
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createPartnerLink(link: Omit<PartnerLink, 'id' | 'created_date'>): Promise<PartnerLink> {
  const { data, error } = await supabase
    .from('partner_links')
    .insert([link])
    .select()
    .single();
  
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Failed to create partner link');
  return data;
}

export async function deletePartnerLink(linkId: number): Promise<void> {
  const { error } = await supabase
    .from('partner_links')
    .delete()
    .eq('id', linkId);
  
  if (error) throw new Error(error.message);
}

// ============================================================================
// Charts API
// ============================================================================

export async function getChartData(chartType: string, partnerId?: string): Promise<any> {
  // Chart data can be fetched from respective tables
  console.warn(`⚠️ Chart data not yet implemented for: ${chartType}`);
  return [];
}

// ============================================================================
// Partner Insights & Recommendations API
// ============================================================================

export async function getInsights(partnerId: string): Promise<PartnerInsight[]> {
  const { data, error } = await supabase
    .from('partner_insights')
    .select('*')
    .eq('partner_id', partnerId)
    .eq('is_active', true)
    .order('priority', { ascending: true })
    .limit(3);
  
  if (error) {
    console.warn('⚠️ Insights not available:', error.message);
    return [];
  }
  
  return data || [];
}

export async function getRecommendations(partnerId: string): Promise<PartnerRecommendation[]> {
  const { data, error } = await supabase
    .from('partner_recommendations')
    .select('*')
    .eq('partner_id', partnerId)
    .eq('is_active', true)
    .order('priority', { ascending: true})
    .limit(3);
  
  if (error) {
    console.warn('⚠️ Recommendations not available:', error.message);
    return [];
  }
  
  return data || [];
}

// ============================================================================
// Affiliate Tips API
// ============================================================================

export async function getRandomTip(): Promise<AffiliateTip> {
  try {
    // Try to use the PostgreSQL function first
    const { data, error } = await supabase.rpc('get_random_tip');
    
    if (!error && data && data.length > 0) {
      return data[0] as AffiliateTip;
    }
    
    // Fallback: query the table directly
    const { data: tipData, error: tipError } = await supabase
      .from('affiliate_tips')
      .select('*')
      .eq('is_active', true)
      .limit(50);
    
    if (!tipError && tipData && tipData.length > 0) {
      // Return a random tip from the results
      const randomIndex = Math.floor(Math.random() * tipData.length);
      return tipData[randomIndex] as AffiliateTip;
    }
  } catch (error) {
    console.warn('⚠️ Could not fetch random tip:', error);
  }
  
  // Return a default tip as fallback
  return {
    id: 0,
    tip_text: 'Focus on building trust before selling. Share educational content about forex trading to establish yourself as an authority in the space.',
    category: 'marketing',
    created_at: new Date().toISOString(),
    is_active: true,
  } as AffiliateTip;
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

