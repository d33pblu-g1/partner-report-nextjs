# Affiliate Tips API Implementation Guide

This document describes the PHP API endpoint that needs to be added to support the Affiliate Tips feature.

## Database Setup

The database migration has been added to `database_migrations.sql`. Run the SQL commands to:
1. Create the `affiliate_tips` table
2. Populate it with 100 forex affiliate/IB tips

```bash
# Connect to MySQL and run the migration
mysql -u your_username -p your_database < database_migrations.sql
```

## PHP API Endpoint

Add the following endpoint to your PHP API (`/api/index.php`):

### Endpoint: `tips`

**URL:** `http://localhost:8001/api/index.php?endpoint=tips`

**Method:** GET

**Description:** Returns a random active affiliate tip from the database

**Implementation:**

```php
case 'tips':
    // Get a random active tip
    $sql = "SELECT * FROM affiliate_tips WHERE is_active = TRUE ORDER BY RAND() LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $tip = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($tip) {
        sendJsonResponse($tip);
    } else {
        http_response_code(404);
        sendJsonResponse(null, false, 'No tips available');
    }
    break;
```

### Response Format

**Success Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "tip_text": "Focus on building trust before selling. Share educational content about forex trading to establish yourself as an authority in the space.",
    "category": "marketing",
    "created_at": "2024-10-23 10:30:00",
    "is_active": true
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "No tips available"
}
```

## Optional: Additional Endpoints

You may also want to add these endpoints for future enhancements:

### Get tips by category

```php
case 'tips_by_category':
    $category = $_GET['category'] ?? '';
    
    if (empty($category)) {
        http_response_code(400);
        sendJsonResponse(null, false, 'Category parameter required');
        break;
    }
    
    $sql = "SELECT * FROM affiliate_tips WHERE category = ? AND is_active = TRUE";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$category]);
    $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendJsonResponse($tips);
    break;
```

### Get all tips

```php
case 'all_tips':
    $sql = "SELECT * FROM affiliate_tips WHERE is_active = TRUE ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendJsonResponse($tips);
    break;
```

## Testing

After implementing the endpoint, test it using:

```bash
# Get a random tip
curl http://localhost:8001/api/index.php?endpoint=tips

# Or use your browser
open http://localhost:8001/api/index.php?endpoint=tips
```

## Frontend Integration

The frontend is already implemented and will automatically work once the API endpoint is available:

- **Types:** `AffiliateTip` interface added to `/src/types/index.ts`
- **API Client:** `getRandomTip()` function in `/src/lib/api.ts`
- **Hook:** `useRandomTip()` in `/src/hooks/useTips.ts`
- **Component:** `TopTipSection` in `/src/components/features/TopTipSection.tsx`
- **Page:** Integrated into home page at `/src/app/page.tsx`

## Features

The implemented frontend features include:

1. ✅ Display a random affiliate tip on the home page
2. ✅ "Get New Tip" button to fetch a fresh random tip
3. ✅ Category badges with icons (marketing, acquisition, retention, etc.)
4. ✅ Color-coded categories for visual distinction
5. ✅ Smooth loading and error states
6. ✅ Responsive design matching the existing UI
7. ✅ Dark mode support
8. ✅ Hover effects and animations

## Categories

The tips are organized into 10 categories:

- **marketing** 📢 - Marketing strategies
- **acquisition** 🎯 - Client acquisition
- **retention** 🔄 - Retention tactics  
- **platforms** 💻 - Platform optimization
- **social_media** 📱 - Social media best practices
- **content** ✍️ - Content creation
- **conversion** 💰 - Conversion optimization
- **compliance** ⚖️ - Compliance & ethics
- **analytics** 📊 - Analytics & tracking
- **relationships** 🤝 - Relationship building

## Next Steps

1. ✅ Database migration completed
2. ⏳ Add PHP API endpoint (see implementation above)
3. ✅ Frontend implementation completed
4. ⏳ Test the integration end-to-end
5. ⏳ Consider adding tip favoriting or bookmarking in the future

