# Cube Endpoints Setup Guide

## Issue
You're seeing `❌ API Response Error: {}` in the console because the cube endpoints are not yet implemented in your PHP backend or the cube tables don't exist in your database.

## Solution Overview

The analytics dashboard expects cube data from these endpoints:
```
GET /api/index.php?endpoint=cubes&cube={cube_name}&partner_id={partner_id}
```

## Step 1: Verify Cube Tables Exist

Check if these tables exist in your MySQL database:

```sql
SHOW TABLES LIKE 'cube_%';
```

Expected tables:
- `cube_daily_trends`
- `cube_daily_commissions_plan`
- `cube_daily_commissions_platform`
- `cube_commissions_product`
- `cube_commissions_symbol`
- `cube_daily_signups`
- `cube_daily_funding`
- `cube_client_demographics`
- `cube_country_performance`
- `cube_product_volume`
- `cube_monthly_deposits`
- `cube_badge_progress`
- `cube_partner_scorecard`

## Step 2: Add Cube Endpoint to PHP API

In your PHP backend (`/api/index.php`), add this endpoint handler:

```php
<?php
// ... existing code ...

case 'cubes':
    $cubeName = $_GET['cube'] ?? null;
    $partnerId = $_GET['partner_id'] ?? null;
    
    if (!$cubeName) {
        sendError('cube parameter is required');
        break;
    }
    
    // Sanitize cube name to prevent SQL injection
    $allowedCubes = [
        'daily_trends',
        'daily_commissions_plan',
        'daily_commissions_platform',
        'commissions_product',
        'commissions_symbol',
        'daily_signups',
        'daily_funding',
        'client_demographics',
        'country_performance',
        'product_volume',
        'monthly_deposits',
        'badge_progress',
        'partner_scorecard'
    ];
    
    if (!in_array($cubeName, $allowedCubes)) {
        sendError('Invalid cube name');
        break;
    }
    
    $tableName = 'cube_' . $cubeName;
    
    try {
        // Build query
        if ($partnerId) {
            $stmt = $conn->prepare("SELECT * FROM {$tableName} WHERE partner_id = ? ORDER BY id DESC LIMIT 1000");
            $stmt->bind_param("s", $partnerId);
        } else {
            $stmt = $conn->prepare("SELECT * FROM {$tableName} ORDER BY id DESC LIMIT 1000");
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        
        sendSuccess($data);
    } catch (Exception $e) {
        sendError('Cube table not found or query error: ' . $e->getMessage());
    }
    break;

// ... rest of your code ...
?>
```

## Step 3: Create Missing Cube Tables (If Needed)

If the cube tables don't exist, you'll need to create them. Here are example schemas:

### cube_daily_trends
```sql
CREATE TABLE IF NOT EXISTS cube_daily_trends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50),
    date DATE,
    new_clients INT DEFAULT 0,
    signups INT DEFAULT 0,
    total_deposits DECIMAL(15,2) DEFAULT 0,
    total_commissions DECIMAL(15,2) DEFAULT 0,
    trade_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_partner (partner_id),
    INDEX idx_date (date)
);
```

### cube_badge_progress
```sql
CREATE TABLE IF NOT EXISTS cube_badge_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50),
    badge_name VARCHAR(100),
    current_value INT DEFAULT 0,
    target_value INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_partner (partner_id)
);
```

### cube_client_demographics
```sql
CREATE TABLE IF NOT EXISTS cube_client_demographics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50),
    age_group VARCHAR(20),
    gender VARCHAR(20),
    language VARCHAR(10),
    count INT DEFAULT 0,
    client_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_partner (partner_id)
);
```

### cube_country_performance
```sql
CREATE TABLE IF NOT EXISTS cube_country_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50),
    country VARCHAR(100),
    clients INT DEFAULT 0,
    client_count INT DEFAULT 0,
    revenue DECIMAL(15,2) DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    trades INT DEFAULT 0,
    trade_count INT DEFAULT 0,
    deposits DECIMAL(15,2) DEFAULT 0,
    total_deposits DECIMAL(15,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_partner (partner_id),
    INDEX idx_country (country)
);
```

### cube_product_volume
```sql
CREATE TABLE IF NOT EXISTS cube_product_volume (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50),
    product VARCHAR(50),
    product_type VARCHAR(50),
    product_name VARCHAR(50),
    volume DECIMAL(20,2) DEFAULT 0,
    total_volume DECIMAL(20,2) DEFAULT 0,
    trades INT DEFAULT 0,
    trade_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_partner (partner_id),
    INDEX idx_product (product)
);
```

## Step 4: Populate Cube Tables with Data

You'll need to populate these cubes with aggregated data from your main tables. Here's an example query to populate `cube_daily_trends`:

```sql
INSERT INTO cube_daily_trends (partner_id, date, new_clients, total_deposits, total_commissions)
SELECT 
    c.partnerId as partner_id,
    DATE(c.joinDate) as date,
    COUNT(DISTINCT c.binary_user_id) as new_clients,
    COALESCE(SUM(d.amount_usd), 0) as total_deposits,
    COALESCE(SUM(t.expected_revenue_usd), 0) as total_commissions
FROM clients c
LEFT JOIN deposits d ON c.binary_user_id = d.binary_user_id_1 
    AND DATE(d.transaction_time) = DATE(c.joinDate)
LEFT JOIN trades t ON c.binary_user_id = t.binary_user_id 
    AND DATE(t.date) = DATE(c.joinDate)
WHERE c.joinDate >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
GROUP BY c.partnerId, DATE(c.joinDate)
ORDER BY date DESC;
```

## Step 5: Test the Endpoints

Test each cube endpoint using curl or your browser:

```bash
# Test daily trends
curl "http://localhost:8001/api/index.php?endpoint=cubes&cube=daily_trends&partner_id=YOUR_PARTNER_ID"

# Test badge progress
curl "http://localhost:8001/api/index.php?endpoint=cubes&cube=badge_progress&partner_id=YOUR_PARTNER_ID"

# Test country performance
curl "http://localhost:8001/api/index.php?endpoint=cubes&cube=country_performance&partner_id=YOUR_PARTNER_ID"
```

Expected response:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "partner_id": "P123",
            "date": "2024-10-23",
            "new_clients": 5,
            "total_deposits": 1500.00,
            "total_commissions": 45.00
        }
    ]
}
```

## Temporary Workaround (For Testing)

If you want to test the UI without real cube data, you can create mock cube tables with sample data:

```sql
-- Create badge progress with sample data
CREATE TABLE IF NOT EXISTS cube_badge_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50),
    badge_name VARCHAR(100),
    current_value INT DEFAULT 0,
    target_value INT DEFAULT 0
);

INSERT INTO cube_badge_progress (partner_id, badge_name, current_value, target_value) VALUES
('P123', 'First 10 Clients', 8, 10),
('P123', '100 Clients', 75, 100),
('P123', '$10K Revenue', 8500, 10000),
('P123', 'Top Performer', 65, 100);

-- Create country performance with sample data
CREATE TABLE IF NOT EXISTS cube_country_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50),
    country VARCHAR(100),
    clients INT DEFAULT 0,
    revenue DECIMAL(15,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0
);

INSERT INTO cube_country_performance (partner_id, country, clients, revenue, conversion_rate) VALUES
('P123', 'United States', 45, 15000, 68.5),
('P123', 'United Kingdom', 32, 12000, 72.3),
('P123', 'Germany', 28, 9500, 65.2),
('P123', 'France', 22, 7800, 61.8),
('P123', 'Australia', 18, 6200, 70.1);
```

## What Charts Will Work Without Cubes

Some charts can still work using the main tables instead of cubes:

✅ **Working (uses main tables):**
- Commission Trends Chart (uses commissions table)
- Client Tier Chart (uses clients table)
- World Map (uses clients table)
- Age Population Pyramid (uses clients table)
- Cohort Heatmap (uses clients table)

⚠️ **Needs Cube Tables:**
- Daily Trends Chart
- Performance Gauge
- Badge Progress Cards
- Commission by Plan/Platform/Product/Symbol
- Demographics Grid
- Country Performance Table
- Product Treemap
- Funding Analytics

## Error Handling

The charts are now configured to:
1. Show a warning in console if cube data is missing
2. Display "No data available" message in the chart
3. Continue working without crashing the app
4. Retry once before giving up

## Next Steps

1. ✅ **Immediate:** Error handling is now in place - charts won't crash
2. 📋 **Short-term:** Create the cube tables in your database
3. 🔧 **Medium-term:** Add the cube endpoint to your PHP API
4. 📊 **Long-term:** Set up automated jobs to refresh cube data daily

## Need Help?

If you need assistance with:
- Creating the cube tables
- Writing the aggregation queries
- Setting up the PHP endpoint
- Debugging specific errors

Just let me know which cube you want to implement first, and I'll provide the exact SQL and PHP code!

