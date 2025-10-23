# Fix Partner Ranks Display - Implementation Guide

## Issue
The home page shows "Rank not available" for Country Rank and Global Rank because the PHP API's partners endpoint doesn't return these fields.

## Step 1: Verify Database Columns

Run this SQL query to check if the columns exist:

```sql
DESCRIBE partners;
```

You should see both `Country_Rank` and `global_rank` columns. If `global_rank` is missing, run the migration below.

## Step 2: Run Database Migration (if needed)

If `global_rank` column doesn't exist, run:

```sql
-- Add global_rank column
ALTER TABLE partners ADD COLUMN global_rank INT DEFAULT NULL;

-- Populate with sample data (ranks between 100 and 200)
UPDATE partners SET global_rank = FLOOR(100 + RAND() * 101);

-- Verify the update
SELECT partner_id, name, Country_Rank, global_rank FROM partners LIMIT 5;
```

## Step 3: Update PHP Backend

**File Location:** Your PHP API directory at `http://localhost:8001/api/index.php`

**Find the partners endpoint case** (should look something like this):

```php
case 'partners':
    $partner_id = $_GET['partner_id'] ?? null;
    
    if ($partner_id) {
        // Single partner query
        $stmt = $pdo->prepare("
            SELECT partner_id, name, tier, country_manager, email, phone, status, created_at
            FROM partners
            WHERE partner_id = ?
        ");
        $stmt->execute([$partner_id]);
        $partner = $stmt->fetch(PDO::FETCH_ASSOC);
        sendSuccess($partner);
    } else {
        // All partners query
        $stmt = $pdo->query("
            SELECT partner_id, name, tier, country_manager, email, phone, status, created_at
            FROM partners
        ");
        $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendSuccess($partners);
    }
    break;
```

**Update BOTH SELECT queries to include the rank columns:**

```php
case 'partners':
    $partner_id = $_GET['partner_id'] ?? null;
    
    if ($partner_id) {
        // Single partner query - UPDATED
        $stmt = $pdo->prepare("
            SELECT partner_id, name, tier, country_manager, Country_Rank, global_rank, 
                   email, phone, status, created_at
            FROM partners
            WHERE partner_id = ?
        ");
        $stmt->execute([$partner_id]);
        $partner = $stmt->fetch(PDO::FETCH_ASSOC);
        sendSuccess($partner);
    } else {
        // All partners query - UPDATED
        $stmt = $pdo->query("
            SELECT partner_id, name, tier, country_manager, Country_Rank, global_rank,
                   email, phone, status, created_at
            FROM partners
        ");
        $partners = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendSuccess($partners);
    }
    break;
```

**Key Changes:**
- Added `Country_Rank` to both SELECT queries
- Added `global_rank` to both SELECT queries

## Step 4: Test the Fix

Run the test script (see `test_partner_ranks.sh` in this directory):

```bash
chmod +x test_partner_ranks.sh
./test_partner_ranks.sh
```

Or manually test with curl:

```bash
# Test with a specific partner ID (replace P-0001 with your actual partner ID)
curl "http://localhost:8001/api/index.php?endpoint=partners&partner_id=P-0001"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "partner_id": "P-0001",
    "name": "John Doe",
    "tier": "Gold",
    "country_manager": "Jane Smith",
    "Country_Rank": 5,
    "global_rank": 142,
    "email": "john@example.com",
    "phone": "+1234567890",
    "status": "active",
    "created_at": "2024-01-15 10:00:00"
  }
}
```

**Important:** The response MUST include both `Country_Rank` and `global_rank` fields.

## Step 5: Verify in Browser

1. Restart your PHP server if needed
2. Open the Next.js app: `http://localhost:3000`
3. Select a specific partner from the dropdown
4. You should now see actual rank numbers instead of "Rank not available"

**What you should see:**
- 🏴 **Country Rank** card showing the rank number with appropriate color
- 🌍 **Global Rank** card showing the rank number with appropriate color
- Performance indicators (e.g., "🎯 Top performer" for ranks ≤50)

## Troubleshooting

### Still seeing "Rank not available"

1. **Check browser console** for any API errors
2. **Verify the API response** includes the rank fields using curl
3. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)
4. **Check that both columns exist** in the database
5. **Ensure ranks are not NULL** in the database:
   ```sql
   SELECT partner_id, Country_Rank, global_rank FROM partners WHERE Country_Rank IS NULL OR global_rank IS NULL;
   ```

### Ranks are NULL in database

If some partners have NULL ranks, update them:

```sql
-- Update NULL Country_Rank values (example: ranks 1-50)
UPDATE partners SET Country_Rank = FLOOR(1 + RAND() * 50) WHERE Country_Rank IS NULL;

-- Update NULL global_rank values (example: ranks 100-200)
UPDATE partners SET global_rank = FLOOR(100 + RAND() * 101) WHERE global_rank IS NULL;
```

### API returns ranks but frontend doesn't show them

Check that the partner is selected:
- Ranks only show when a specific partner is selected (not "All partners")
- Verify `isSpecificPartner` condition on line 26 of `src/app/page.tsx`

## Files Modified

**Backend (requires manual update):**
- `[PHP_API_DIR]/api/index.php` - Update the `partners` endpoint case

**Database:**
- `partners` table - Ensure `Country_Rank` and `global_rank` columns exist and have values

**Frontend (no changes needed):**
- Already correctly configured to display ranks
- See `src/app/page.tsx` lines 55-67
- See `src/components/features/RankCard.tsx`

## Success Criteria

✅ Database has both `Country_Rank` and `global_rank` columns
✅ PHP API returns both rank fields in the response
✅ Frontend displays actual rank numbers instead of "Rank not available"
✅ Rank colors and badges display based on rank value
✅ Performance indicators show below ranks

## Next Steps

After implementing this fix:
1. Consider adding rank change tracking (delta from previous period)
2. Add country name to the Country Rank card
3. Implement rank history charts
4. Add rankings page showing all partners sorted by rank

