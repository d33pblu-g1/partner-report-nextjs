#!/usr/bin/env python3
"""
Bulk Import MySQL Data to Supabase
This script automatically imports all CSV files to Supabase using the REST API
"""

import os
import csv
import json
from urllib import request, error
from urllib.parse import urlencode

# Configuration
SUPABASE_URL = "https://brpwxtnllxoxwwsvkmpi.supabase.co"
SUPABASE_ANON_KEY = "sb_publishable_aVpGxvQw_D7Kq-jBrMR4EQ_RFdlJ_H-"
IMPORT_DIR = "/Users/michalisphytides/Desktop/partner-report/supabase_import"

# Tables to import (in order to respect foreign keys)
TABLES_ORDER = [
    "partners",
    "badges",
    "partner_tier_config",
    "clients",
    "deposits",
    "trades",
    "partner_links",
    "partner_badges",
    "partner_tiers",
    "partner_monthly_commissions",
]

def read_csv_file(filepath):
    """Read CSV file and return list of dictionaries"""
    rows = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            # Read CSV
            reader = csv.DictReader(f)
            for row in reader:
                # Convert empty strings to None
                cleaned_row = {}
                for key, value in row.items():
                    if value == '' or value == 'NULL' or value == '\\N':
                        cleaned_row[key] = None
                    else:
                        cleaned_row[key] = value
                rows.append(cleaned_row)
        return rows
    except Exception as e:
        print(f"   ❌ Error reading file: {e}")
        return []

def insert_batch_to_supabase(table_name, data_batch):
    """Insert a batch of data to Supabase table"""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}"
    
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    try:
        data = json.dumps(data_batch).encode('utf-8')
        req = request.Request(url, data=data, headers=headers, method='POST')
        
        with request.urlopen(req) as response:
            return response.status == 201 or response.status == 200
    except error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"   ❌ HTTP Error {e.code}: {error_body[:200]}")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def import_table(table_name):
    """Import a single table from CSV to Supabase"""
    csv_file = os.path.join(IMPORT_DIR, f"{table_name}.csv")
    
    if not os.path.exists(csv_file):
        print(f"⚠️  {table_name}: File not found, skipping")
        return True
    
    print(f"📤 Importing {table_name}...")
    
    # Read CSV data
    rows = read_csv_file(csv_file)
    
    if not rows:
        print(f"   ⚠️  No data to import")
        return True
    
    print(f"   Found {len(rows)} rows")
    
    # Import in batches of 100
    batch_size = 100
    total_imported = 0
    
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        print(f"   Importing rows {i+1} to {min(i+batch_size, len(rows))}...", end=" ")
        
        if insert_batch_to_supabase(table_name, batch):
            print("✅")
            total_imported += len(batch)
        else:
            print("❌ Failed")
            return False
    
    print(f"   ✅ Imported {total_imported}/{len(rows)} rows\n")
    return True

def clear_table(table_name):
    """Clear all data from a table"""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}"
    
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
        'Prefer': 'return=minimal'
    }
    
    try:
        # Delete all rows (be careful!)
        req = request.Request(url + '?id=neq.0', headers=headers, method='DELETE')
        with request.urlopen(req) as response:
            return True
    except:
        return False

def main():
    """Main import function"""
    print("🚀 Supabase Bulk Data Import")
    print("=" * 50)
    print()
    
    # Ask for confirmation
    print(f"📁 Import directory: {IMPORT_DIR}")
    print(f"🎯 Supabase project: {SUPABASE_URL}")
    print()
    print(f"📋 Tables to import: {len(TABLES_ORDER)}")
    print()
    
    response = input("⚠️  This will import data to Supabase. Continue? (yes/no): ")
    if response.lower() != 'yes':
        print("❌ Import cancelled")
        return
    
    print()
    print("Starting import...")
    print()
    
    # Import each table
    success_count = 0
    failed_tables = []
    
    for table_name in TABLES_ORDER:
        if import_table(table_name):
            success_count += 1
        else:
            failed_tables.append(table_name)
    
    # Summary
    print()
    print("=" * 50)
    print("✅ Import Complete!")
    print("=" * 50)
    print()
    print(f"✅ Successfully imported: {success_count}/{len(TABLES_ORDER)} tables")
    
    if failed_tables:
        print(f"❌ Failed tables: {', '.join(failed_tables)}")
    
    print()
    print("🔍 Verify your data:")
    print(f"   {SUPABASE_URL}/dashboard/project/brpwxtnllxoxwwsvkmpi/editor")
    print()

if __name__ == "__main__":
    main()

