# Partner Links Table Feature

## Overview
Comprehensive partner links tracking system with detailed commission information, performance metrics, and link management capabilities.

## Database Schema

### Table: `partner_links`

| Field | Type | Description |
|-------|------|-------------|
| **commission_id** | INT (PK, AUTO_INCREMENT) | Unique identifier for each link |
| **partner_id** | VARCHAR(20) | Foreign key to partners table |
| **commission_plan** | VARCHAR(100) | Commission structure (e.g., "Revenue Share 30%", "CPA $200") |
| **type** | VARCHAR(50) | Link type: banner, text, email, social, video, blog |
| **target** | VARCHAR(100) | Target audience or campaign (e.g., "New Traders", "YouTube Audience") |
| **language** | VARCHAR(10) | Language code (en, es, fr, de, etc.) |
| **url** | VARCHAR(2048) | The tracking URL |
| **landing_page** | VARCHAR(2048) | Destination landing page |
| **description** | TEXT | Optional description of the link |
| **click_count** | INT | Total clicks on this link |
| **conversion_count** | INT | Total conversions from this link |
| **status** | ENUM | active, inactive, pending, archived |
| **created_at** | TIMESTAMP | When the link was created |
| **updated_at** | TIMESTAMP | Last modification timestamp |

### Indexes
- `idx_partner_id` - Fast filtering by partner
- `idx_type` - Fast filtering by link type
- `idx_status` - Fast filtering by status
- `idx_commission_plan` - Fast filtering by commission plan

## Features

### 📊 Statistics Dashboard
Real-time metrics displayed at the top of the page:

1. **Total Links**: Number of active and inactive links
2. **Total Clicks**: Cumulative click count across all links
3. **Conversions**: Total number of successful conversions
4. **Conversion Rate**: Percentage of clicks that converted

### 🔍 Filtering & Search

**Search Capabilities:**
- Partner ID
- Link type
- URL
- Target audience
- Commission plan

**Status Filter:**
- All
- Active
- Inactive
- Pending
- Archived

### 📋 Table Columns

1. **Commission ID** - Unique identifier
2. **Partner ID** - Which partner owns the link
3. **Commission Plan** - Revenue share or CPA details
4. **Type** - Badge showing link type (banner, social, etc.)
5. **Target** - Intended audience
6. **Language** - Language code (EN, ES, FR, etc.)
7. **URL** - Clickable tracking link (truncated for display)
8. **Landing Page** - Clickable destination URL
9. **Clicks** - Total click count
10. **Conversions** - Total conversion count
11. **Status** - Color-coded status badge
12. **Actions** - Delete/Archive button

### 🎨 Status Colors

- **Active**: Green badge - Link is live and tracking
- **Inactive**: Gray badge - Link is disabled
- **Pending**: Yellow badge - Awaiting approval
- **Archived**: Red badge - Link is archived/deleted

### 🗑️ Link Management

**Delete/Archive:**
- Click the trash icon in the Actions column
- Confirmation dialog appears
- Soft delete: Status changes to "archived"
- Link data preserved for historical reporting

## API Endpoints

### GET `/api/partner_links`

**Get all links:**
```
GET /api/index.php?endpoint=partner_links
```

**Get links for specific partner:**
```
GET /api/index.php?endpoint=partner_links&partner_id=162153
```

**Get specific link:**
```
GET /api/index.php?endpoint=partner_links&commission_id=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "commission_id": 1,
      "partner_id": "162153",
      "commission_plan": "Revenue Share 30%",
      "type": "banner",
      "target": "New Traders",
      "language": "en",
      "url": "https://tracking.deriv.com/SH8J9k_162153",
      "landing_page": "https://deriv.com/signup",
      "description": "Main banner for homepage - 728x90",
      "click_count": 156,
      "conversion_count": 23,
      "status": "active",
      "created_at": "2025-01-22 10:30:00",
      "updated_at": "2025-01-22 10:30:00"
    }
  ]
}
```

### POST `/api/partner_links`

**Create new link:**
```json
POST /api/index.php?endpoint=partner_links
Content-Type: application/json

{
  "partner_id": "162153",
  "commission_plan": "Revenue Share 30%",
  "type": "banner",
  "target": "Mobile Users",
  "language": "en",
  "url": "https://tracking.deriv.com/MOBILE_162153",
  "landing_page": "https://deriv.com/mobile",
  "description": "Mobile app promotion banner"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "commission_id": 26,
    "message": "Link added successfully"
  }
}
```

### PUT `/api/partner_links`

**Update existing link:**
```json
PUT /api/index.php?endpoint=partner_links&commission_id=1
Content-Type: application/json

{
  "status": "inactive",
  "click_count": 200,
  "conversion_count": 30
}
```

### DELETE `/api/partner_links`

**Archive link (soft delete):**
```
DELETE /api/index.php?endpoint=partner_links&commission_id=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Link deleted successfully"
  }
}
```

## Sample Data

The database is populated with 25 sample links across 3 partners:

### Partner 162153 (Mirza) - 10 links
- Various types: banner, text, social, video, email, blog
- Multiple languages: en, es, de
- Different targets: New Traders, YouTube Audience, Social Media, etc.
- Performance metrics: 156-567 clicks, 6-78 conversions

### Partner P-0001 (Apex Affiliates) - 8 links
- Premium focus: High Rollers, VIP traders
- High-value campaigns
- Performance metrics: 67-1234 clicks, 12-156 conversions

### Partner P-0002 (BrightReach Media) - 7 links
- Diverse campaigns: Forex, Crypto, Mobile, Social
- Multi-language: en, fr
- Performance metrics: 123-890 clicks, 18-112 conversions

## Link Types

### 1. **Banner**
- Display advertising
- Various sizes (728x90, 300x250, etc.)
- High visibility, moderate click-through

### 2. **Text**
- Simple text links
- Embedded in content
- Low visibility, high intent clicks

### 3. **Email**
- Email newsletter links
- Targeted audience
- Moderate click-through, high conversion

### 4. **Social**
- Social media links
- Facebook, Twitter, Instagram, LinkedIn
- High reach, variable conversion

### 5. **Video**
- YouTube, TikTok video descriptions
- Engaged audience
- High click-through, good conversion

### 6. **Blog**
- Blog post embeds
- SEO-driven traffic
- Quality audience, good conversion

## Commission Plans

### Revenue Share
- **30%**: Standard tier
- **32%**: Above average
- **35%**: Premium tier
- **40%**: VIP tier

### CPA (Cost Per Acquisition)
- **$150**: Entry level
- **$200**: Standard
- **$250**: Premium
- **$300**: VIP

### Hybrid
- Combination of revenue share + CPA
- Best of both models
- Balanced risk/reward

## Performance Metrics

### Click Count
- Tracks total link clicks
- Updated in real-time
- Used for engagement analysis

### Conversion Count
- Tracks successful sign-ups/deposits
- High-value metric
- Used for ROI calculation

### Conversion Rate
```
Conversion Rate = (Conversions / Clicks) × 100
```

**Industry Benchmarks:**
- 0-2%: Poor performance
- 2-5%: Average performance
- 5-10%: Good performance
- 10%+: Excellent performance

## User Interface

### Header Section
```
┌─────────────────────────────────────────────┐
│  Partner Links                              │
│  Manage and track affiliate links           │
└─────────────────────────────────────────────┘
```

### Stats Cards
```
┌─────────┬─────────┬─────────┬─────────┐
│ Total   │ Total   │ Conv-   │ Conv    │
│ Links   │ Clicks  │ ersions │ Rate    │
│  25     │  8,190  │  1,251  │ 15.27%  │
│ 23 act  │ all time│ total   │ average │
└─────────┴─────────┴─────────┴─────────┘
```

### Filters
```
┌───────────────────────────────────────────┐
│ Search: [_________________________]       │
│ Status: [All Status ▼]                    │
└───────────────────────────────────────────┘
```

### Table View
```
┌──────┬─────────┬──────────────┬──────┬────────┬──────┬───────┬────────┬────────┬────────┬────────┬─────────┐
│ Comm │ Partner │ Commission   │ Type │ Target │ Lang │ URL   │ Landing│ Clicks │ Conver │ Status │ Actions │
│ ID   │ ID      │ Plan         │      │        │      │       │ Page   │        │ sions  │        │         │
├──────┼─────────┼──────────────┼──────┼────────┼──────┼───────┼────────┼────────┼────────┼────────┼─────────┤
│ #1   │ 162153  │ Revenue 30%  │banner│ New    │ EN   │ http..│ http...│  156   │   23   │ active │  🗑️     │
│ #2   │ 162153  │ Revenue 30%  │ text │ Exper..│ EN   │ http..│ http...│   89   │   12   │ active │  🗑️     │
│ #3   │ 162153  │ CPA $200     │social│ Social │ EN   │ http..│ http...│  234   │   45   │ active │  🗑️     │
└──────┴─────────┴──────────────┴──────┴────────┴──────┴───────┴────────┴────────┴────────┴────────┴─────────┘
```

## Responsive Design

### Desktop (1200px+)
- Full table with all columns visible
- 4-column stats grid
- 2-column filter grid
- Hover effects on table rows

### Tablet (768px-1199px)
- Scrollable table
- 2-column stats grid
- 2-column filter grid
- Touch-friendly buttons

### Mobile (< 768px)
- Horizontally scrollable table
- 1-column stats grid
- 1-column filter grid
- Larger touch targets

## Dark Mode Support

All components adapt to dark/light theme:

**Light Theme:**
- White backgrounds
- Gray text
- Blue accents
- Subtle shadows

**Dark Theme:**
- Dark gray backgrounds
- Light text
- Blue accents
- Pronounced borders

## Testing

### Manual Test Checklist

- [ ] Page loads without errors
- [ ] Stats cards display correct totals
- [ ] All 25 links appear in table
- [ ] Search filters links correctly
- [ ] Status filter works
- [ ] Click counts display correctly
- [ ] Conversion counts display correctly
- [ ] URLs are clickable and open in new tab
- [ ] Landing pages are clickable
- [ ] Delete button shows confirmation
- [ ] Delete archives the link
- [ ] Table updates after delete
- [ ] Dark mode works
- [ ] Mobile responsive design works
- [ ] Partner filter works

### API Test Commands

**Test GET all links:**
```bash
curl "http://localhost:8001/api/index.php?endpoint=partner_links"
```

**Test GET partner links:**
```bash
curl "http://localhost:8001/api/index.php?endpoint=partner_links&partner_id=162153"
```

**Test POST new link:**
```bash
curl -X POST "http://localhost:8001/api/index.php?endpoint=partner_links" \
  -H "Content-Type: application/json" \
  -d '{"partner_id":"162153","type":"banner","url":"https://test.com","language":"en"}'
```

**Test DELETE link:**
```bash
curl -X DELETE "http://localhost:8001/api/index.php?endpoint=partner_links&commission_id=25"
```

## Future Enhancements

### Short Term
1. **Add New Link Form**: Modal to create new links
2. **Edit Link**: Inline editing of link details
3. **Bulk Actions**: Archive multiple links at once
4. **Export**: Download links as CSV/Excel

### Medium Term
1. **Click Tracking**: Real-time click tracking
2. **Conversion Tracking**: Automated conversion attribution
3. **A/B Testing**: Compare link performance
4. **QR Codes**: Generate QR codes for links

### Long Term
1. **Link Analytics**: Detailed performance charts
2. **Geo-Tracking**: Track clicks by country
3. **Device Tracking**: Track by mobile/desktop
4. **Heat Maps**: Visual click patterns

## Troubleshooting

### Issue: Links not loading
**Solution:** Check PHP server is running on port 8001

### Issue: Delete not working
**Solution:** Verify commission_id is correct and link exists

### Issue: Stats showing 0
**Solution:** Check database has sample data loaded

### Issue: Search not working
**Solution:** Clear search term and try again

## Files

### Database
- `/create_partner_links_extended_table.sql` - Table schema and sample data

### API
- `/api/endpoints/partner_links.php` - CRUD operations

### Frontend (Next.js)
- `/src/app/partner-links/page.tsx` - Main page component

## Status
✅ **COMPLETE** - Partner links table with full CRUD operations!

---

**Track every affiliate link with detailed performance metrics! 📊🔗✨**

