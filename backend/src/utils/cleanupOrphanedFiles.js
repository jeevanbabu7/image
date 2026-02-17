const fs = require("fs");
const path = require("path");
const { UPLOAD_DIR } = require("./constants");

/**
 * Cleanup utility to remove orphaned files from uploads directory
 * Files older than the specified age (in minutes) will be deleted
 */
async function cleanupOrphanedFiles(maxAgeMinutes = 15) {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      return 0;
    }

    const files = await fs.promises.readdir(UPLOAD_DIR);
    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;
    let deletedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
      // Skip .gitkeep file
      if (file === ".gitkeep") {
        continue;
      }

      const filePath = path.join(UPLOAD_DIR, file);
      
      try {
        const stats = await fs.promises.stat(filePath);
        const ageMinutes = Math.floor((now - stats.mtimeMs) / 1000 / 60);
        
        // Check if file is older than max age
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.promises.unlink(filePath);
          deletedCount++;
          console.log(`🗑️  Deleted: ${file} (age: ${ageMinutes} min)`);
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.warn(`⚠️  Failed to process file ${file}:`, error.message);
      }
    }

    const timestamp = new Date().toLocaleTimeString();
    if (deletedCount > 0) {
      console.log(`✅ [${timestamp}] Cleanup: ${deletedCount} file(s) deleted, ${skippedCount} kept`);
    } else if (skippedCount > 0) {
      console.log(`ℹ️  [${timestamp}] Cleanup: ${skippedCount} file(s) still fresh (< ${maxAgeMinutes} min)`);
    } else {
      console.log(`ℹ️  [${timestamp}] Cleanup: No files in uploads directory`);
    }
    
    return deletedCount;
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  }
}

/**
 * Start automatic cleanup at regular intervals
 */
function startAutomaticCleanup(intervalMinutes = 10, maxAgeMinutes = 15) {
  console.log(`⏰ Automatic cleanup configured:`);
  console.log(`   - Runs every: ${intervalMinutes} minutes`);
  console.log(`   - Deletes files older than: ${maxAgeMinutes} minutes`);
  console.log(`   - First run: immediately\n`);
  
  // Run immediately on start
  cleanupOrphanedFiles(maxAgeMinutes).catch(err => {
    console.error("❌ Initial cleanup failed:", err);
  });
  
  // Then run at intervals
  const intervalMs = intervalMinutes * 60 * 1000;
  const cleanupInterval = setInterval(() => {
    console.log(`\n⏰ Running scheduled cleanup...`);
    cleanupOrphanedFiles(maxAgeMinutes).catch(err => {
      console.error("❌ Scheduled cleanup failed:", err);
    });
  }, intervalMs);
  
  // Log next cleanup time
  const nextCleanup = new Date(Date.now() + intervalMs);
  console.log(`⏭️  Next cleanup: ${nextCleanup.toLocaleTimeString()}\n`);
  
  return cleanupInterval;
}

module.exports = {
  cleanupOrphanedFiles,
  startAutomaticCleanup
};
