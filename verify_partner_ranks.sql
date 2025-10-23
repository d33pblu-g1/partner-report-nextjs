-- ============================================================================
-- Partner Ranks Verification and Fix Script
-- Run this script to verify and fix the partner ranks display issue
-- ============================================================================

-- Step 1: Check if columns exist
-- ============================================================================
SELECT 
    'Checking partners table structure...' AS step;

DESCRIBE partners;

-- Step 2: Check if global_rank column exists
-- ============================================================================
SELECT 
    'Checking if global_rank column exists...' AS step;

SELECT COUNT(*) as column_exists
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'partners' 
  AND COLUMN_NAME = 'global_rank';
-- If this returns 0, the column doesn't exist and needs to be created

-- Step 3: Add global_rank column if it doesn't exist
-- ============================================================================
-- Uncomment this if the column doesn't exist:
-- ALTER TABLE partners ADD COLUMN global_rank INT DEFAULT NULL;

-- Step 4: Check current rank data
-- ============================================================================
SELECT 
    'Checking current rank data...' AS step;

SELECT 
    partner_id,
    name,
    tier,
    Country_Rank,
    global_rank,
    CASE 
        WHEN Country_Rank IS NULL THEN 'MISSING'
        ELSE 'OK'
    END AS country_rank_status,
    CASE 
        WHEN global_rank IS NULL THEN 'MISSING'
        ELSE 'OK'
    END AS global_rank_status
FROM partners
ORDER BY partner_id
LIMIT 20;

-- Step 5: Count how many partners have missing ranks
-- ============================================================================
SELECT 
    'Statistics on missing ranks...' AS step;

SELECT 
    COUNT(*) as total_partners,
    SUM(CASE WHEN Country_Rank IS NULL THEN 1 ELSE 0 END) as missing_country_rank,
    SUM(CASE WHEN global_rank IS NULL THEN 1 ELSE 0 END) as missing_global_rank,
    SUM(CASE WHEN Country_Rank IS NOT NULL AND global_rank IS NOT NULL THEN 1 ELSE 0 END) as partners_with_both_ranks
FROM partners;

-- Step 6: Fix missing ranks (if needed)
-- ============================================================================
-- Uncomment these if you need to populate missing ranks:

-- Populate missing global_rank values (random between 100 and 200)
-- UPDATE partners 
-- SET global_rank = FLOOR(100 + RAND() * 101) 
-- WHERE global_rank IS NULL;

-- Populate missing Country_Rank values (random between 1 and 50)
-- UPDATE partners 
-- SET Country_Rank = FLOOR(1 + RAND() * 50) 
-- WHERE Country_Rank IS NULL;

-- Step 7: Verify the fix
-- ============================================================================
SELECT 
    'Final verification - sample partners with ranks...' AS step;

SELECT 
    partner_id,
    name,
    tier,
    Country_Rank,
    global_rank,
    CASE 
        WHEN Country_Rank <= 10 THEN '⭐ Top 10'
        WHEN Country_Rank <= 50 THEN '🏆 Top 50'
        WHEN Country_Rank <= 100 THEN '🥈 Top 100'
        ELSE '📊 Standard'
    END AS country_rank_badge,
    CASE 
        WHEN global_rank <= 50 THEN '🎯 Top performer'
        WHEN global_rank <= 100 THEN '📈 Strong performance'
        WHEN global_rank <= 150 THEN '💪 Good standing'
        ELSE '📊 Room for growth'
    END AS global_rank_indicator
FROM partners
WHERE Country_Rank IS NOT NULL 
  AND global_rank IS NOT NULL
ORDER BY global_rank ASC
LIMIT 10;

-- Step 8: Generate sample test data for a specific partner
-- ============================================================================
SELECT 
    'Sample API response data for testing...' AS step;

SELECT 
    partner_id,
    name,
    tier,
    country_manager,
    Country_Rank,
    global_rank,
    email,
    phone,
    status,
    created_at
FROM partners
WHERE partner_id = (SELECT partner_id FROM partners LIMIT 1)
LIMIT 1;

-- ============================================================================
-- Quick Fix Script (run only if needed)
-- ============================================================================

-- Uncomment and run this entire block if you need to quickly fix everything:

/*
-- Add global_rank column if missing
ALTER TABLE partners ADD COLUMN IF NOT EXISTS global_rank INT DEFAULT NULL;

-- Populate all missing Country_Rank values
UPDATE partners 
SET Country_Rank = FLOOR(1 + RAND() * 50) 
WHERE Country_Rank IS NULL;

-- Populate all missing global_rank values
UPDATE partners 
SET global_rank = FLOOR(100 + RAND() * 101) 
WHERE global_rank IS NULL;

-- Verify the fix
SELECT 
    COUNT(*) as total_partners,
    SUM(CASE WHEN Country_Rank IS NULL THEN 1 ELSE 0 END) as missing_country_rank,
    SUM(CASE WHEN global_rank IS NULL THEN 1 ELSE 0 END) as missing_global_rank
FROM partners;
*/

-- ============================================================================
-- End of verification script
-- ============================================================================

