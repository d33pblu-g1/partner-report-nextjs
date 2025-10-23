# API Endpoints Specification

## Partner Rankings and Insights API

### 1. Get Partner Insights

**Endpoint:** `GET /api/index.php?endpoint=insights&partner_id={partner_id}`

**Description:** Returns the top 3 active insights for a specific partner.

**Query Parameters:**
- `partner_id` (required): The partner's ID

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "partner_id": "P123",
      "insight_text": "Your customers trading trends have been shifting from synthetics to crypto over the past 3 months",
      "category": "trading_behavior",
      "priority": 1,
      "created_at": "2024-10-20 10:30:00"
    },
    {
      "id": 2,
      "partner_id": "P123",
      "insight_text": "Most of your customers this month have traded on their mobile phone",
      "category": "device_usage",
      "priority": 2,
      "created_at": "2024-10-20 10:30:00"
    },
    {
      "id": 3,
      "partner_id": "P123",
      "insight_text": "Your most profitable link was the Instagram campaign",
      "category": "link_performance",
      "priority": 3,
      "created_at": "2024-10-20 10:30:00"
    }
  ]
}
```

**SQL Query:**
```sql
SELECT * FROM partner_insights 
WHERE partner_id = ? AND is_active = TRUE 
ORDER BY priority ASC 
LIMIT 3;
```

**Error Response:**
```json
{
  "success": false,
  "error": "Partner not found"
}
```

---

### 2. Get Partner Recommendations

**Endpoint:** `GET /api/index.php?endpoint=recommendations&partner_id={partner_id}`

**Description:** Returns the top 3 active recommendations for a specific partner.

**Query Parameters:**
- `partner_id` (required): The partner's ID

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "partner_id": "P123",
      "recommendation_text": "You have a healthy acquisition channel; you should concentrate more on activation and reactivation campaigns",
      "category": "strategy",
      "priority": 1,
      "action_url": "/clients",
      "created_at": "2024-10-20 10:30:00"
    },
    {
      "id": 2,
      "partner_id": "P123",
      "recommendation_text": "Most of your customers are stuck on KYC verification. Consider creating a step-by-step guide",
      "category": "onboarding",
      "priority": 2,
      "action_url": null,
      "created_at": "2024-10-20 10:30:00"
    },
    {
      "id": 3,
      "partner_id": "P123",
      "recommendation_text": "You have 45 dormant clients. Launch a reactivation email campaign",
      "category": "retention",
      "priority": 3,
      "action_url": "/clients",
      "created_at": "2024-10-20 10:30:00"
    }
  ]
}
```

**SQL Query:**
```sql
SELECT * FROM partner_recommendations 
WHERE partner_id = ? AND is_active = TRUE 
ORDER BY priority ASC 
LIMIT 3;
```

---

### 3. Updated Partners Endpoint

**Endpoint:** `GET /api/index.php?endpoint=partners` or `GET /api/index.php?endpoint=partners&partner_id={partner_id}`

**Description:** Existing endpoint updated to include `global_rank` field.

**Updated Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "partner_id": "P123",
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
  ]
}
```

**Changes Required:**
- Update SELECT query to include `global_rank` column
- Ensure `global_rank` is included in JSON response

---

## PHP Implementation Example

```php
// In index.php, add these cases to the endpoint switch

case 'insights':
    $partner_id = $_GET['partner_id'] ?? null;
    
    if (!$partner_id) {
        sendError('partner_id is required');
        break;
    }
    
    $stmt = $conn->prepare("
        SELECT * FROM partner_insights 
        WHERE partner_id = ? AND is_active = TRUE 
        ORDER BY priority ASC 
        LIMIT 3
    ");
    $stmt->bind_param("s", $partner_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $insights = $result->fetch_all(MYSQLI_ASSOC);
    
    sendSuccess($insights);
    break;

case 'recommendations':
    $partner_id = $_GET['partner_id'] ?? null;
    
    if (!$partner_id) {
        sendError('partner_id is required');
        break;
    }
    
    $stmt = $conn->prepare("
        SELECT * FROM partner_recommendations 
        WHERE partner_id = ? AND is_active = TRUE 
        ORDER BY priority ASC 
        LIMIT 3
    ");
    $stmt->bind_param("s", $partner_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $recommendations = $result->fetch_all(MYSQLI_ASSOC);
    
    sendSuccess($recommendations);
    break;
```

---

## Testing

**Test Insights Endpoint:**
```bash
curl "http://localhost:8001/api/index.php?endpoint=insights&partner_id=P123"
```

**Test Recommendations Endpoint:**
```bash
curl "http://localhost:8001/api/index.php?endpoint=recommendations&partner_id=P123"
```

**Test Updated Partners Endpoint:**
```bash
curl "http://localhost:8001/api/index.php?endpoint=partners&partner_id=P123"
```

