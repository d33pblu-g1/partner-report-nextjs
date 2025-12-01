/**
 * useBadges Hook
 * React Query hook for fetching badge data
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api/index.php';

interface Badge {
  badge_id: number;
  badge_name: string;
  badge_criteria: string;
  badge_trigger: string;
  badge_icon: string;
  badge_color: string;
  created_at?: string;
}

interface PartnerBadge {
  badge_id: number;
  badge_name: string;
  badge_icon: string;
  badge_color: string;
  badge_criteria: string;
  earned_at: string;
  progress?: number;
}

interface BadgeProgress {
  badge_id: number;
  badge_name: string;
  badge_icon: string;
  badge_color: string;
  badge_criteria: string;
  badge_trigger: string;
  current_value: number;
  target_value: number;
  progress_percentage: number;
  earned: boolean;
  earned_at?: string;
}

/**
 * Fetch all available badges
 */
export function useAllBadges(): UseQueryResult<Badge[], Error> {
  return useQuery({
    queryKey: ['badges', 'all'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}?endpoint=badges&action=list`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch badges');
      }
      // Ensure we always return an array
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    },
  });
}

/**
 * Fetch badges earned by a specific partner
 */
export function usePartnerBadges(partnerId?: string): UseQueryResult<PartnerBadge[], Error> {
  return useQuery({
    queryKey: ['badges', 'partner', partnerId],
    queryFn: async () => {
      if (!partnerId) return [];
      const response = await axios.get(`${API_BASE_URL}?endpoint=badges&action=partner&partner_id=${partnerId}`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch partner badges');
      }
      // Ensure we always return an array
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!partnerId,
  });
}

/**
 * Fetch badge progress for a specific partner
 */
export function useBadgeProgress(partnerId?: string): UseQueryResult<BadgeProgress[], Error> {
  return useQuery({
    queryKey: ['badges', 'progress', partnerId],
    queryFn: async () => {
      if (!partnerId) return [];
      const response = await axios.get(`${API_BASE_URL}?endpoint=badges&action=progress&partner_id=${partnerId}`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch badge progress');
      }
      // Ensure we always return an array
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!partnerId,
  });
}

/**
 * Fetch badge summary statistics
 */
export function useBadgeSummary(): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['badges', 'summary'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}?endpoint=badges&action=summary`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch badge summary');
      }
      return response.data.data;
    },
  });
}

