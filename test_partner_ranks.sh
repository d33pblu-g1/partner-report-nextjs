#!/bin/bash

# ============================================================================
# Partner Ranks API Test Script
# Tests if the PHP API returns Country_Rank and global_rank fields
# ============================================================================

echo "=================================="
echo "Partner Ranks API Test"
echo "=================================="
echo ""

# Configuration
API_BASE_URL="http://localhost:8001/api/index.php"
API_ENDPOINT="partners"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Get all partners
echo "Test 1: Fetching all partners..."
echo "URL: ${API_BASE_URL}?endpoint=${API_ENDPOINT}"
echo ""

RESPONSE=$(curl -s "${API_BASE_URL}?endpoint=${API_ENDPOINT}")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ API is reachable${NC}"
    echo ""
    echo "Response (first 500 chars):"
    echo "$RESPONSE" | head -c 500
    echo ""
    echo ""
    
    # Check if response contains rank fields
    if echo "$RESPONSE" | grep -q "Country_Rank"; then
        echo -e "${GREEN}✓ Response contains Country_Rank field${NC}"
    else
        echo -e "${RED}✗ Response does NOT contain Country_Rank field${NC}"
    fi
    
    if echo "$RESPONSE" | grep -q "global_rank"; then
        echo -e "${GREEN}✓ Response contains global_rank field${NC}"
    else
        echo -e "${RED}✗ Response does NOT contain global_rank field${NC}"
    fi
else
    echo -e "${RED}✗ Failed to reach API${NC}"
    echo "Make sure the PHP server is running on http://localhost:8001"
    exit 1
fi

echo ""
echo "=================================="
echo ""

# Test 2: Get first partner ID and test single partner endpoint
echo "Test 2: Fetching specific partner..."
echo ""

# Extract first partner_id from the response
PARTNER_ID=$(echo "$RESPONSE" | grep -o '"partner_id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PARTNER_ID" ]; then
    echo -e "${YELLOW}⚠ Could not extract partner_id from response${NC}"
    echo "Please manually test with a known partner ID:"
    echo "curl \"${API_BASE_URL}?endpoint=${API_ENDPOINT}&partner_id=YOUR_PARTNER_ID\""
else
    echo "Testing with partner_id: $PARTNER_ID"
    echo "URL: ${API_BASE_URL}?endpoint=${API_ENDPOINT}&partner_id=${PARTNER_ID}"
    echo ""
    
    SINGLE_RESPONSE=$(curl -s "${API_BASE_URL}?endpoint=${API_ENDPOINT}&partner_id=${PARTNER_ID}")
    
    echo "Response:"
    echo "$SINGLE_RESPONSE" | jq '.' 2>/dev/null || echo "$SINGLE_RESPONSE"
    echo ""
    
    # Check for required fields
    echo "Field Validation:"
    
    if echo "$SINGLE_RESPONSE" | grep -q '"partner_id"'; then
        echo -e "${GREEN}✓ partner_id${NC}"
    else
        echo -e "${RED}✗ partner_id${NC}"
    fi
    
    if echo "$SINGLE_RESPONSE" | grep -q '"name"'; then
        echo -e "${GREEN}✓ name${NC}"
    else
        echo -e "${RED}✗ name${NC}"
    fi
    
    if echo "$SINGLE_RESPONSE" | grep -q '"Country_Rank"'; then
        COUNTRY_RANK=$(echo "$SINGLE_RESPONSE" | grep -o '"Country_Rank":[0-9]*' | cut -d':' -f2)
        if [ -n "$COUNTRY_RANK" ] && [ "$COUNTRY_RANK" != "null" ]; then
            echo -e "${GREEN}✓ Country_Rank: $COUNTRY_RANK${NC}"
        else
            echo -e "${YELLOW}⚠ Country_Rank field exists but value is null${NC}"
        fi
    else
        echo -e "${RED}✗ Country_Rank (MISSING - THIS IS THE PROBLEM)${NC}"
        echo ""
        echo "ACTION REQUIRED:"
        echo "Update your PHP API's partners endpoint to include Country_Rank in the SELECT query"
    fi
    
    if echo "$SINGLE_RESPONSE" | grep -q '"global_rank"'; then
        GLOBAL_RANK=$(echo "$SINGLE_RESPONSE" | grep -o '"global_rank":[0-9]*' | cut -d':' -f2)
        if [ -n "$GLOBAL_RANK" ] && [ "$GLOBAL_RANK" != "null" ]; then
            echo -e "${GREEN}✓ global_rank: $GLOBAL_RANK${NC}"
        else
            echo -e "${YELLOW}⚠ global_rank field exists but value is null${NC}"
        fi
    else
        echo -e "${RED}✗ global_rank (MISSING - THIS IS THE PROBLEM)${NC}"
        echo ""
        echo "ACTION REQUIRED:"
        echo "Update your PHP API's partners endpoint to include global_rank in the SELECT query"
    fi
fi

echo ""
echo "=================================="
echo "Test Summary"
echo "=================================="
echo ""

# Overall assessment
if echo "$SINGLE_RESPONSE" | grep -q '"Country_Rank"' && echo "$SINGLE_RESPONSE" | grep -q '"global_rank"'; then
    echo -e "${GREEN}✓ SUCCESS! Both rank fields are present in the API response${NC}"
    echo ""
    echo "Your ranks should now display correctly on the home page."
    echo "Refresh your browser to see the changes."
else
    echo -e "${RED}✗ ISSUE DETECTED! Rank fields are missing from the API response${NC}"
    echo ""
    echo "Required Actions:"
    echo "1. Update your PHP API's partners endpoint SELECT query to include:"
    echo "   - Country_Rank"
    echo "   - global_rank"
    echo ""
    echo "2. See FIX_PARTNER_RANKS_IMPLEMENTATION.md for detailed instructions"
    echo ""
    echo "3. Run verify_partner_ranks.sql to check your database"
fi

echo ""
echo "=================================="

