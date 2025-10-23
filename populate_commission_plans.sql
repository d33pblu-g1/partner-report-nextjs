-- ============================================================================
-- Populate Commission Plans Migration
-- ============================================================================
-- Purpose: Populate the commissionplan field in the clients table with
--          randomly distributed dummy data
-- Values: CPA, RevShare, Turnover
-- ============================================================================

-- Update all clients with random commission plan assignments
UPDATE clients 
SET commissionplan = CASE 
    WHEN RAND() < 0.33 THEN 'CPA'
    WHEN RAND() < 0.66 THEN 'RevShare'
    ELSE 'Turnover'
END;

-- Verify the distribution
SELECT 
    commissionplan,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM clients), 2) as percentage
FROM clients
GROUP BY commissionplan
ORDER BY commissionplan;

-- ============================================================================
-- To execute this migration:
-- mysql -u [username] -p [database_name] < populate_commission_plans.sql
-- 
-- Or from MySQL command line:
-- source populate_commission_plans.sql;
-- ============================================================================

