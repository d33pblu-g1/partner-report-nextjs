# Quick Fix Guide - Partner Ranks Not Displaying

## The Problem
Home page shows "Rank not available" instead of rank numbers.

## The Cause
PHP API doesn't return `Country_Rank` and `global_rank` fields.

## The Fix (2 minutes)

### 1. Check Database (30 seconds)
```sql
DESCRIBE partners;
```
Ensure `Country_Rank` and `global_rank` columns exist.

If `global_rank` is missing:
```sql
ALTER TABLE partners ADD COLUMN global_rank INT DEFAULT NULL;
UPDATE partners SET global_rank = FLOOR(100 + RAND() * 101);
```

### 2. Update PHP Backend (1 minute)
**File**: Your PHP API's `/api/index.php`

**Find this** (in the `case 'partners':` section):
```php
SELECT partner_id, name, tier, country_manager, email, phone, status, created_at
FROM partners
WHERE partner_id = ?
```

**Change to this**:
```php
SELECT partner_id, name, tier, country_manager, Country_Rank, global_rank, email, phone, status, created_at
FROM partners
WHERE partner_id = ?
```

**Important**: Update BOTH queries (single partner AND all partners) if there are two separate SELECT statements.

### 3. Test (30 seconds)
```bash
./test_partner_ranks.sh
```

Or manually:
```bash
curl "http://localhost:8001/api/index.php?endpoint=partners&partner_id=YOUR_PARTNER_ID"
```

Should include:
```json
{
  "Country_Rank": 5,
  "global_rank": 142
}
```

### 4. Verify in Browser
1. Refresh page (Ctrl+F5 or Cmd+Shift+R)
2. Select a specific partner
3. See rank numbers instead of "Rank not available"

## Done! ✅

---

## If It Doesn't Work

Run database check:
```bash
mysql -u root -p your_database < verify_partner_ranks.sql
```

Check for:
- [ ] Columns exist in database
- [ ] Rank values are not NULL
- [ ] PHP query includes rank columns
- [ ] API response contains rank fields
- [ ] PHP server restarted after changes

## Full Documentation

- `FIX_PARTNER_RANKS_IMPLEMENTATION.md` - Detailed guide
- `PARTNER_RANKS_FIX_SUMMARY.md` - Complete overview
- `verify_partner_ranks.sql` - Database diagnostic
- `test_partner_ranks.sh` - API test script

---

**TL;DR**: Add `Country_Rank, global_rank` to your PHP SELECT query.

