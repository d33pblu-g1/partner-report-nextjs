#!/usr/bin/env node
/**
 * Bulk Import MySQL Data to Supabase
 * Uses Supabase JavaScript SDK for reliable import
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = 'https://brpwxtnllxoxwwsvkmpi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_aVpGxvQw_D7Kq-jBrMR4EQ_RFdlJ_H-';
const IMPORT_DIR = '/Users/michalisphytides/Desktop/partner-report/supabase_import';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tables to import (in order to respect foreign keys)
const TABLES_ORDER = [
  'partners',
  'badges',
  'partner_tier_config',
  'clients',
  'deposits',
  'trades',
  'partner_links',
  'partner_badges',
  'partner_tiers',
  'partner_monthly_commissions',
];

/**
 * Parse CSV file and return array of objects
 */
function parseCSV(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) return [];
    
    // Get headers
    const headers = lines[0].split(',');
    
    // Parse rows
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        // Convert empty strings, NULL, or \N to null
        if (!value || value === 'NULL' || value === '\\N' || value === '') {
          row[header] = null;
        } else {
          row[header] = value;
        }
      });
      
      rows.push(row);
    }
    
    return rows;
  } catch (error) {
    console.error(`   ❌ Error reading file: ${error.message}`);
    return [];
  }
}

/**
 * Import a batch of data to Supabase
 */
async function importBatch(tableName, batch) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(batch);
    
    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`);
    return false;
  }
}

/**
 * Import a single table
 */
async function importTable(tableName) {
  const csvFile = path.join(IMPORT_DIR, `${tableName}.csv`);
  
  if (!fs.existsSync(csvFile)) {
    console.log(`⚠️  ${tableName}: File not found, skipping`);
    return true;
  }
  
  console.log(`\n📤 Importing ${tableName}...`);
  
  // Read CSV data
  const rows = parseCSV(csvFile);
  
  if (rows.length === 0) {
    console.log(`   ⚠️  No data to import`);
    return true;
  }
  
  console.log(`   Found ${rows.length} rows`);
  
  // Import in batches of 50 (Supabase limit)
  const batchSize = 50;
  let totalImported = 0;
  
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    process.stdout.write(`   Importing rows ${i + 1} to ${Math.min(i + batchSize, rows.length)}... `);
    
    const success = await importBatch(tableName, batch);
    
    if (success) {
      console.log('✅');
      totalImported += batch.length;
    } else {
      console.log('❌');
      return false;
    }
  }
  
  console.log(`   ✅ Imported ${totalImported}/${rows.length} rows`);
  return true;
}

/**
 * Main import function
 */
async function main() {
  console.log('🚀 Supabase Bulk Data Import');
  console.log('='.repeat(50));
  console.log();
  console.log(`📁 Import directory: ${IMPORT_DIR}`);
  console.log(`🎯 Supabase project: ${SUPABASE_URL}`);
  console.log();
  console.log(`📋 Tables to import: ${TABLES_ORDER.length}`);
  console.log();
  console.log('Starting import...');
  console.log();
  
  // Import each table
  let successCount = 0;
  const failedTables = [];
  
  for (const tableName of TABLES_ORDER) {
    const success = await importTable(tableName);
    if (success) {
      successCount++;
    } else {
      failedTables.push(tableName);
    }
  }
  
  // Summary
  console.log();
  console.log('='.repeat(50));
  console.log('✅ Import Complete!');
  console.log('='.repeat(50));
  console.log();
  console.log(`✅ Successfully imported: ${successCount}/${TABLES_ORDER.length} tables`);
  
  if (failedTables.length > 0) {
    console.log(`❌ Failed tables: ${failedTables.join(', ')}`);
  }
  
  console.log();
  console.log('🔍 Verify your data:');
  console.log(`   https://supabase.com/dashboard/project/brpwxtnllxoxwwsvkmpi/editor`);
  console.log();
}

// Run the script
main().catch(console.error);

