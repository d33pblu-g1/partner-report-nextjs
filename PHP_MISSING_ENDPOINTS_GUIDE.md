# Missing PHP Backend Endpoints - Complete Implementation Guide

## Overview
This guide provides the code needed to implement all missing backend endpoints that are currently showing demo data on the frontend.

## Current Status
✅ **Frontend Fixed** - All sections now show graceful demo data instead of errors  
⏳ **Backend Needed** - The following endpoints need to be implemented:

1. **Tips Endpoint** - `endpoint=tips`
2. **Insights Endpoint** - `endpoint=insights&partner_id={partner_id}`
3. **Recommendations Endpoint** - `endpoint=recommendations&partner_id={partner_id}`

---

## 1. Tips Endpoint

### Database Table
Ensure the `affiliate_tips` table exists:

```sql
CREATE TABLE IF NOT EXISTS affiliate_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tip_text TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### PHP Implementation

Add this to your switch statement in `/api/index.php`:

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

### Test Command
```bash
curl 'http://localhost:8001/api/index.php?endpoint=tips'
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "id": 42,
    "tip_text": "Focus on building trust before selling...",
    "category": "marketing",
    "created_at": "2024-10-23 12:45:00",
    "is_active": 1
  }
}
```

---

## 2. Insights Endpoint

### Database Table
Create the `partner_insights` table:

```sql
CREATE TABLE IF NOT EXISTS partner_insights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50) NOT NULL,
    insight_text TEXT NOT NULL,
    category VARCHAR(50),
    priority INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_partner (partner_id),
    INDEX idx_active (is_active)
);
```

### Sample Data
```sql
INSERT INTO partner_insights (partner_id, insight_text, category, priority) VALUES
('P-0001', 'Your client trading trends have been shifting from synthetics to crypto over the past 3 months', 'trading_behavior', 1),
('P-0001', 'Most of your clients this month have traded on their mobile phone', 'device_usage', 2),
('P-0001', 'Your most profitable link was the Instagram campaign', 'link_performance', 3);
```

### PHP Implementation

```php
case 'insights':
    $partner_id = $_GET['partner_id'] ?? null;
    
    if (!$partner_id) {
        sendError('partner_id is required');
        break;
    }
    
    try {
        // Get top 3 active insights for the partner
        $sql = "SELECT * FROM partner_insights 
                WHERE partner_id = ? AND is_active = TRUE 
                ORDER BY priority ASC 
                LIMIT 3";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$partner_id]);
        $insights = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendSuccess($insights);
    } catch (PDOException $e) {
        sendError('Database error: ' . $e->getMessage());
    }
    break;
```

### Test Command
```bash
curl 'http://localhost:8001/api/index.php?endpoint=insights&partner_id=P-0001'
```

### Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "partner_id": "P-0001",
      "insight_text": "Your client trading trends have been shifting...",
      "category": "trading_behavior",
      "priority": 1,
      "created_at": "2024-10-23 10:30:00",
      "is_active": 1
    },
    {
      "id": 2,
      "partner_id": "P-0001",
      "insight_text": "Most of your clients this month...",
      "category": "device_usage",
      "priority": 2,
      "created_at": "2024-10-23 10:30:00",
      "is_active": 1
    },
    {
      "id": 3,
      "partner_id": "P-0001",
      "insight_text": "Your most profitable link...",
      "category": "link_performance",
      "priority": 3,
      "created_at": "2024-10-23 10:30:00",
      "is_active": 1
    }
  ]
}
```

---

## 3. Recommendations Endpoint

### Database Table
Create the `partner_recommendations` table:

```sql
CREATE TABLE IF NOT EXISTS partner_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50) NOT NULL,
    recommendation_text TEXT NOT NULL,
    category VARCHAR(50),
    priority INT DEFAULT 1,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_partner (partner_id),
    INDEX idx_active (is_active)
);
```

### Sample Data
```sql
INSERT INTO partner_recommendations (partner_id, recommendation_text, category, priority, action_url) VALUES
('P-0001', 'You have a healthy acquisition channel; you should concentrate more on activation and reactivation campaigns', 'strategy', 1, '/clients'),
('P-0001', 'Most of your customers are stuck on KYC verification. Consider creating a step-by-step guide', 'onboarding', 2, NULL),
('P-0001', 'You have 45 dormant clients. Launch a reactivation email campaign', 'retention', 3, '/clients');
```

### PHP Implementation

```php
case 'recommendations':
    $partner_id = $_GET['partner_id'] ?? null;
    
    if (!$partner_id) {
        sendError('partner_id is required');
        break;
    }
    
    try {
        // Get top 3 active recommendations for the partner
        $sql = "SELECT * FROM partner_recommendations 
                WHERE partner_id = ? AND is_active = TRUE 
                ORDER BY priority ASC 
                LIMIT 3";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$partner_id]);
        $recommendations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        sendSuccess($recommendations);
    } catch (PDOException $e) {
        sendError('Database error: ' . $e->getMessage());
    }
    break;
```

### Test Command
```bash
curl 'http://localhost:8001/api/index.php?endpoint=recommendations&partner_id=P-0001'
```

### Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "partner_id": "P-0001",
      "recommendation_text": "You have a healthy acquisition channel...",
      "category": "strategy",
      "priority": 1,
      "action_url": "/clients",
      "created_at": "2024-10-23 10:30:00",
      "is_active": 1
    },
    {
      "id": 2,
      "partner_id": "P-0001",
      "recommendation_text": "Most of your customers are stuck...",
      "category": "onboarding",
      "priority": 2,
      "action_url": null,
      "created_at": "2024-10-23 10:30:00",
      "is_active": 1
    },
    {
      "id": 3,
      "partner_id": "P-0001",
      "recommendation_text": "You have 45 dormant clients...",
      "category": "retention",
      "priority": 3,
      "action_url": "/clients",
      "created_at": "2024-10-23 10:30:00",
      "is_active": 1
    }
  ]
}
```

---

## Complete PHP API Structure

Here's how your `/api/index.php` should look with all endpoints:

```php
<?php
// ... existing headers and database connection code ...

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
    
    case 'insights':
        $partner_id = $_GET['partner_id'] ?? null;
        
        if (!$partner_id) {
            sendError('partner_id is required');
            break;
        }
        
        try {
            $sql = "SELECT * FROM partner_insights 
                    WHERE partner_id = ? AND is_active = TRUE 
                    ORDER BY priority ASC 
                    LIMIT 3";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$partner_id]);
            $insights = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            sendSuccess($insights);
        } catch (PDOException $e) {
            sendError('Database error: ' . $e->getMessage());
        }
        break;
    
    case 'recommendations':
        $partner_id = $_GET['partner_id'] ?? null;
        
        if (!$partner_id) {
            sendError('partner_id is required');
            break;
        }
        
        try {
            $sql = "SELECT * FROM partner_recommendations 
                    WHERE partner_id = ? AND is_active = TRUE 
                    ORDER BY priority ASC 
                    LIMIT 3";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$partner_id]);
            $recommendations = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            sendSuccess($recommendations);
        } catch (PDOException $e) {
            sendError('Database error: ' . $e->getMessage());
        }
        break;
    
    default:
        sendError('Endpoint not found');
        break;
}
```

---

## Quick Setup Script

Run these SQL commands to set up all tables at once:

```sql
-- Create affiliate_tips table
CREATE TABLE IF NOT EXISTS affiliate_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tip_text TEXT NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create partner_insights table
CREATE TABLE IF NOT EXISTS partner_insights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50) NOT NULL,
    insight_text TEXT NOT NULL,
    category VARCHAR(50),
    priority INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_partner (partner_id),
    INDEX idx_active (is_active)
);

-- Create partner_recommendations table
CREATE TABLE IF NOT EXISTS partner_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    partner_id VARCHAR(50) NOT NULL,
    recommendation_text TEXT NOT NULL,
    category VARCHAR(50),
    priority INT DEFAULT 1,
    action_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_partner (partner_id),
    INDEX idx_active (is_active)
);
```

---

## Testing All Endpoints

After implementing, test all endpoints:

```bash
# Test tips
curl 'http://localhost:8001/api/index.php?endpoint=tips'

# Test insights
curl 'http://localhost:8001/api/index.php?endpoint=insights&partner_id=P-0001'

# Test recommendations
curl 'http://localhost:8001/api/index.php?endpoint=recommendations&partner_id=P-0001'
```

---

## What Happens After Implementation

Once you implement these endpoints:

1. **Tips Section** - Will show real random tips instead of the demo tip
2. **Insights Section** - Will show partner-specific insights from the database
3. **Recommendations Section** - Will show partner-specific recommendations
4. **Demo badges** - The "Demo • Backend setup required" badges will disappear
5. **Auto-switching** - Frontend automatically detects when endpoints are available

---

## Troubleshooting

### "No data found"
**Solution:** Insert sample data for your partners using the SQL examples above.

### "partner_id is required"
**Solution:** Ensure you're passing the partner_id parameter in the URL.

### "Database error"
**Solution:** Check database credentials and table existence.

### Still seeing demo data after implementation
**Solution:** 
1. Clear browser cache
2. Verify endpoints return success with curl
3. Check browser console for any errors
4. Refresh the page (Ctrl+F5 / Cmd+Shift+R)

---

## Summary

**Current State (Frontend):**
- ✅ Tips showing demo data
- ✅ Insights showing demo data  
- ✅ Recommendations showing demo data
- ✅ No error messages visible
- ✅ Beautiful UI maintained

**Next Steps (Backend):**
1. Create the three database tables
2. Add the three switch cases to your PHP API
3. Insert sample data for testing
4. Test each endpoint with curl
5. Refresh your frontend - it will automatically use real data!

The frontend is production-ready and will gracefully switch from demo data to real data as soon as the backend endpoints are available.

