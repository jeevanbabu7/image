#!/usr/bin/env node

/**
 * Test Script - Automatic Cleanup Demo
 * This demonstrates how the automatic cleanup works
 */

const { startAutomaticCleanup, cleanupOrphanedFiles } = require("./src/utils/cleanupOrphanedFiles");
const fs = require("fs");
const path = require("path");

console.log("=".repeat(60));
console.log("   AUTOMATIC FILE CLEANUP DEMONSTRATION");
console.log("=".repeat(60));
console.log("\n📋 This is how your backend automatically cleans files:\n");

// Demo configuration
const DEMO_INTERVAL = 1; // 1 minute for demo (actual: 10 minutes)
const DEMO_MAX_AGE = 2;  // 2 minutes for demo (actual: 15 minutes)

console.log("🔧 Configuration (in production):");
console.log("   - Cleanup runs every: 10 minutes");
console.log("   - Deletes files older than: 15 minutes");
console.log("   - Starts automatically with server\n");

console.log("🎯 What happens:");
console.log("   1. User uploads file → temporarily stored");
console.log("   2. Server processes in memory → returns result");
console.log("   3. Upload file deleted IMMEDIATELY");
console.log("   4. Background cleanup removes any orphaned files\n");

console.log("🧹 Cleanup triggers:");
console.log("   ✅ Immediately after processing (direct deletion)");
console.log("   ✅ Every 10 minutes (automatic scan)");
console.log("   ✅ On server restart (initial scan)\n");

console.log("=".repeat(60));
console.log("\n🚀 Starting demo with shorter intervals...\n");

// Start automatic cleanup with demo intervals
const cleanupHandle = startAutomaticCleanup(DEMO_INTERVAL, DEMO_MAX_AGE);

// Let it run for a bit to show the logs
setTimeout(() => {
  console.log("\n=".repeat(60));
  console.log("✅ Demo complete! In production, this runs 24/7.");
  console.log("=".repeat(60));
  console.log("\n💡 Your server is configured with:");
  console.log("   - Zero persistent storage");
  console.log("   - Automatic cleanup every 10 minutes");
  console.log("   - Files auto-delete after 15 minutes");
  console.log("\n🎉 No manual intervention required!\n");
  
  clearInterval(cleanupHandle);
  process.exit(0);
}, 8000);
