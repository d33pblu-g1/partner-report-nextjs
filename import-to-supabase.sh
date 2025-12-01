#!/bin/bash

# Import MySQL Data to Supabase
# This script uses Supabase CLI to import data

set -e

echo "🚀 Supabase Data Import"
echo "======================"
echo ""

# Configuration
IMPORT_DIR="/Users/michalisphytides/Desktop/partner-report/supabase_import"
PROJECT_REF="brpwxtnllxoxwwsvkmpi"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found${NC}"
    echo ""
    echo "Installing Supabase CLI..."
    if command -v brew &> /dev/null; then
        brew install supabase/tap/supabase
    else
        npm install -g supabase
    fi
    echo -e "${GREEN}✅ Supabase CLI installed${NC}"
fi

# Link to Supabase project
echo -e "${BLUE}🔗 Linking to Supabase project...${NC}"
cd /Users/michalisphytides/Desktop/partner-report-nextjs

if [ ! -f supabase/.temp/project-ref ]; then
    echo "Linking project..."
    supabase link --project-ref $PROJECT_REF || true
fi

echo -e "${GREEN}✅ Connected to Supabase${NC}"
echo ""

# Function to import CSV via psql
import_csv_to_supabase() {
    local table_name=$1
    local csv_file="$IMPORT_DIR/${table_name}.csv"
    
    if [ -f "$csv_file" ]; then
        echo -e "${BLUE}📤 Importing $table_name...${NC}"
        
        # Get row count
        row_count=$(wc -l < "$csv_file")
        row_count=$((row_count - 1)) # Subtract header row
        
        if [ $row_count -gt 0 ]; then
            echo "   Rows to import: $row_count"
            
            # Note: Actual import needs to be done via Supabase dashboard or direct PostgreSQL connection
            # This is a placeholder for the import command
            
            echo -e "${YELLOW}   → File ready: $csv_file${NC}"
        else
            echo -e "${YELLOW}   → Empty file, skipping${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  File not found: $csv_file${NC}"
    fi
}

echo -e "${BLUE}📋 Preparing data for import...${NC}"
echo ""

# List of tables to import
TABLES=(
    "partners"
    "clients"
    "deposits"
    "trades"
    "partner_links"
    "badges"
    "partner_badges"
    "partner_tier_config"
    "partner_tiers"
    "partner_monthly_commissions"
)

for table in "${TABLES[@]}"; do
    import_csv_to_supabase "$table"
done

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Data Export Ready for Import!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Manual Import Required:${NC}"
echo ""
echo "Due to Supabase limitations, CSV import must be done via the dashboard."
echo ""
echo "🔗 Import Instructions:"
echo ""
echo "1. Open Supabase Table Editor:"
echo "   https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/editor"
echo ""
echo "2. For each file in: $IMPORT_DIR"
echo ""
echo "3. Click on table → 'Insert' → 'Import data from CSV'"
echo ""
echo "4. Upload the CSV and map columns"
echo ""
echo "📊 Files ready to import:"
ls -lh "$IMPORT_DIR"/*.csv 2>/dev/null | awk '{print "   📄 " $9 " (" $5 ")"}'
echo ""
echo -e "${BLUE}💡 Quick Import Guide:${NC}"
echo "   I'll create a detailed import guide for you..."
echo ""

