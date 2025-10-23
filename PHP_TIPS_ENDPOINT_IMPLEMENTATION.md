# PHP Tips Endpoint - Implementation Guide

## Overview
This guide provides the exact code to add the `tips` endpoint to your PHP API to resolve the "Failed to load tip: Endpoint not found" error on the home page.

## Step 1: Verify Database Table Exists

First, check if the `affiliate_tips` table exists in your database:

```bash
mysql -u your_username -p
```

```sql
USE your_database_name;
SHOW TABLES LIKE 'affiliate_tips';
```

If the table doesn't exist, run the migration from `database_migrations.sql`:

```bash
mysql -u your_username -p your_database < database_migrations.sql
```

Or manually create it:

```sql
CREATE TABLE IF NOT EXISTS affiliate_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tip_text TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

## Step 2: Add the Tips Endpoint to PHP API

Open your PHP API file (likely `/api/index.php`) and add this case to your switch statement:

### For PDO-based API:

```php
case 'tips':
    try {
        // Get a random active tip
        $sql = "SELECT * FROM affiliate_tips WHERE is_active = TRUE ORDER BY RAND() LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $tip = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($tip) {
            sendSuccess($tip);
        } else {
            sendError('No tips available');
        }
    } catch (PDOException $e) {
        sendError('Database error: ' . $e->getMessage());
    }
    break;
```

### For MySQLi-based API:

```php
case 'tips':
    // Get a random active tip
    $sql = "SELECT * FROM affiliate_tips WHERE is_active = TRUE ORDER BY RAND() LIMIT 1";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $tip = $result->fetch_assoc();
        sendSuccess($tip);
    } else {
        sendError('No tips available');
    }
    break;
```

## Step 3: Locate the Switch Statement

Your PHP API file should have a structure like this:

```php
<?php
// ... existing code ...

$endpoint = $_GET['endpoint'] ?? '';

switch ($endpoint) {
    case 'partners':
        // existing code
        break;
    
    case 'metrics':
        // existing code
        break;
    
    case 'clients':
        // existing code
        break;
    
    // ADD THE TIPS CASE HERE
    case 'tips':
        try {
            $sql = "SELECT * FROM affiliate_tips WHERE is_active = TRUE ORDER BY RAND() LIMIT 1";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $tip = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($tip) {
                sendSuccess($tip);
            } else {
                sendError('No tips available');
            }
        } catch (PDOException $e) {
            sendError('Database error: ' . $e->getMessage());
        }
        break;
    
    default:
        sendError('Endpoint not found');
        break;
}
```

## Step 4: Expected Response Format

The endpoint should return data in this format:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "tip_text": "Focus on building trust before selling. Share educational content about forex trading to establish yourself as an authority in the space.",
    "category": "marketing",
    "created_at": "2024-10-23 10:30:00",
    "is_active": 1
  }
}
```

## Step 5: Test the Endpoint

After adding the code, test it:

### Using curl:
```bash
curl http://localhost:8001/api/index.php?endpoint=tips
```

### Using browser:
Open: `http://localhost:8001/api/index.php?endpoint=tips`

### Expected successful response:
```json
{
  "success": true,
  "data": {
    "id": 42,
    "tip_text": "Use retargeting pixels to re-engage visitors who didn't convert on their first visit.",
    "category": "conversion",
    "created_at": "2024-10-23 12:45:00",
    "is_active": 1
  }
}
```

## Step 6: Verify Frontend Integration

Once the endpoint is working:

1. **Start your Next.js dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the home page**: `http://localhost:3000`

3. **You should see**:
   - A "Top Tip" card with a random affiliate tip
   - A "Get New Tip" button that fetches a new random tip
   - No more "Failed to load tip: Endpoint not found" error

## Troubleshooting

### Error: "No tips available"
**Solution:** The `affiliate_tips` table is empty. Run the migration SQL to populate it with tips:
```bash
mysql -u your_username -p your_database < database_migrations.sql
```

### Error: "Table 'affiliate_tips' doesn't exist"
**Solution:** Create the table using the SQL in Step 1.

### Error: "Endpoint not found"
**Possible causes:**
1. The PHP API server is not running
2. The `case 'tips':` was not added to the switch statement
3. The API base URL is incorrect

**Check:**
```bash
# Verify PHP server is running
curl http://localhost:8001/api/index.php?endpoint=partners

# Test the tips endpoint
curl http://localhost:8001/api/index.php?endpoint=tips
```

### Error: "Database connection failed"
**Solution:** Check your database credentials in the PHP API configuration file.

## Summary

After completing these steps:
- ✅ The `tips` endpoint will be available at `http://localhost:8001/api/index.php?endpoint=tips`
- ✅ The home page will display random affiliate tips
- ✅ Users can click "Get New Tip" to fetch new tips
- ✅ No more error messages on the home page

## Need Help?

If you encounter issues:
1. Check the PHP error logs
2. Enable error display in PHP (for development only):
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```
3. Check browser console for any JavaScript errors
4. Verify the API base URL in `.env.local` or your config

