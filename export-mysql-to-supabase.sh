#!/bin/bash

# Export MySQL Data and Prepare for Supabase Import
# This script exports all tables from MySQL and prepares them for Supabase

set -e

echo "🗄️  MySQL to Supabase Data Migration"
echo "======================================"
echo ""

# Configuration
MYSQL_DB="partner_report"
MYSQL_USER="root"
EXPORT_DIR="/Users/michalisphytides/Desktop/partner-report/supabase_import"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create export directory
echo -e "${BLUE}📁 Creating export directory...${NC}"
mkdir -p "$EXPORT_DIR"
cd "$EXPORT_DIR"

# List of tables to export
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
    "client_metrics"
    "country_stats"
    "monthly_commissions"
    "partner_monthly_commissions"
)

# Export each table to CSV
echo -e "${BLUE}📊 Exporting tables to CSV...${NC}"
echo ""

for table in "${TABLES[@]}"; do
    echo -e "${BLUE}Exporting ${table}...${NC}"
    
    # Check if table exists and has data
    row_count=$(mysql -u $MYSQL_USER $MYSQL_DB -sNe "SELECT COUNT(*) FROM $table" 2>/dev/null || echo "0")
    
    if [ "$row_count" -gt 0 ]; then
        # Export to CSV with proper escaping
        mysql -u $MYSQL_USER $MYSQL_DB -e "
            SELECT * FROM $table
        " --batch --raw | sed 's/\t/,/g' > "${table}.csv"
        
        echo -e "${GREEN}✅ Exported $row_count rows from $table${NC}"
    else
        echo -e "${YELLOW}⚠️  Table $table is empty or doesn't exist, skipping${NC}"
    fi
    echo ""
done

# Export cube tables (these might be large, so we'll sample if needed)
echo -e "${BLUE}📊 Exporting cube tables (samples)...${NC}"
echo ""

CUBE_TABLES=(
    "cube_daily_signups"
    "cube_daily_trends"
    "cube_daily_funding"
    "cube_daily_commissions_platform"
    "cube_daily_commissions_plan"
    "cube_commissions_symbol"
    "cube_commissions_product"
    "cube_product_volume"
    "cube_monthly_deposits"
    "cube_partner_countries"
)

for table in "${CUBE_TABLES[@]}"; do
    echo -e "${BLUE}Exporting ${table}...${NC}"
    
    row_count=$(mysql -u $MYSQL_USER $MYSQL_DB -sNe "SELECT COUNT(*) FROM $table" 2>/dev/null || echo "0")
    
    if [ "$row_count" -gt 0 ]; then
        # Export all rows (or limit if too large)
        if [ "$row_count" -gt 10000 ]; then
            mysql -u $MYSQL_USER $MYSQL_DB -e "
                SELECT * FROM $table LIMIT 10000
            " --batch --raw | sed 's/\t/,/g' > "${table}.csv"
            echo -e "${GREEN}✅ Exported 10000 rows from $table (limited from $row_count total)${NC}"
        else
            mysql -u $MYSQL_USER $MYSQL_DB -e "
                SELECT * FROM $table
            " --batch --raw | sed 's/\t/,/g' > "${table}.csv"
            echo -e "${GREEN}✅ Exported $row_count rows from $table${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Table $table is empty or doesn't exist, skipping${NC}"
    fi
    echo ""
done

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Export Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📊 Exported files location:"
echo "   $EXPORT_DIR"
echo ""
echo "📝 Files exported:"
ls -lh *.csv 2>/dev/null | awk '{print "   " $9 " (" $5 ")"}'
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Go to Supabase Table Editor:"
echo "   https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/editor"
echo ""
echo "2. For each table:"
echo "   a. Click on the table name"
echo "   b. Click 'Insert' → 'Import data from CSV'"
echo "   c. Upload the corresponding CSV file"
echo "   d. Map columns (should auto-match)"
echo "   e. Click 'Import'"
echo ""
echo "3. Or use the Supabase CLI:"
echo "   cd /Users/michalisphytides/Desktop/partner-report-nextjs"
echo "   ./import-to-supabase.sh"
echo ""

