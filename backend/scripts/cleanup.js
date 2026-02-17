#!/usr/bin/env node

/**
 * Manual Cleanup Script
 * Run this script manually to cleanup orphaned files in uploads directory
 * 
 * Usage:
 *   node scripts/cleanup.js [maxAgeMinutes]
 * 
 * Examples:
 *   node scripts/cleanup.js        # Delete files older than 15 minutes (default)
 *   node scripts/cleanup.js 5      # Delete files older than 5 minutes
 *   node scripts/cleanup.js 0      # Delete ALL files (except .gitkeep)
 */

const { cleanupOrphanedFiles } = require("../src/utils/cleanupOrphanedFiles");

async function main() {
  const maxAgeMinutes = process.argv[2] ? parseInt(process.argv[2]) : 15;

  console.log("========================================");
  console.log("   Manual Cleanup Script");
  console.log("========================================");
  console.log(`Target: Files older than ${maxAgeMinutes} minutes`);
  console.log("----------------------------------------\n");

  try {
    const deletedCount = await cleanupOrphanedFiles(maxAgeMinutes);
    
    console.log("\n========================================");
    console.log(`✅ Cleanup completed successfully!`);
    console.log(`   Deleted: ${deletedCount} file(s)`);
    console.log("========================================");
    
    process.exit(0);
  } catch (error) {
    console.error("\n========================================");
    console.error("❌ Cleanup failed!");
    console.error(`   Error: ${error.message}`);
    console.error("========================================");
    
    process.exit(1);
  }
}

main();
