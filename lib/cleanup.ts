import fs from 'fs';
import path from 'path';

/**
 * Auto cleanup utility for generated images
 * Removes images older than specified hours from the public directory
 */

export interface CleanupOptions {
  maxAgeHours?: number;
  dryRun?: boolean;
  patterns?: string[];
}

export interface CleanupResult {
  deletedFiles: string[];
  totalDeleted: number;
  totalSize: number;
  errors: string[];
}

/**
 * Clean up old generated images from public directory
 * @param options Cleanup configuration options
 * @returns Promise<CleanupResult>
 */
export async function cleanupOldImages(options: CleanupOptions = {}): Promise<CleanupResult> {
  const {
    maxAgeHours = 24, // Default 24 hours
    dryRun = false,
    patterns = [
      'gemini-image-*.png',
      'fashion-tryOn-*.png', 
      'product-image-*.png'
    ]
  } = options;

  const publicDir = path.join(process.cwd(), 'public');
  const result: CleanupResult = {
    deletedFiles: [],
    totalDeleted: 0,
    totalSize: 0,
    errors: []
  };

  try {
    // Get all files in public directory
    const files = fs.readdirSync(publicDir);
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert hours to milliseconds

    for (const file of files) {
      // Check if file matches any of the patterns
      const matchesPattern = patterns.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(file);
      });

      if (!matchesPattern) continue;

      const filePath = path.join(publicDir, file);
      
      try {
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtime.getTime();

        // If file is older than maxAge, delete it
        if (fileAge > maxAge) {
          if (!dryRun) {
            fs.unlinkSync(filePath);
          }
          
          result.deletedFiles.push(file);
          result.totalDeleted++;
          result.totalSize += stats.size;
          
          console.log(`${dryRun ? '[DRY RUN] Would delete' : 'Deleted'}: ${file} (${Math.round(fileAge / (1000 * 60 * 60))}h old, ${Math.round(stats.size / 1024)}KB)`);
        }
      } catch (fileError) {
        const errorMsg = `Error processing file ${file}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`;
        result.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    console.log(`Cleanup completed: ${result.totalDeleted} files deleted, ${Math.round(result.totalSize / 1024)}KB freed`);
    
  } catch (error) {
    const errorMsg = `Error during cleanup: ${error instanceof Error ? error.message : 'Unknown error'}`;
    result.errors.push(errorMsg);
    console.error(errorMsg);
  }

  return result;
}

/**
 * Get information about generated images in public directory
 * @returns Promise<{files: Array<{name: string, size: number, age: number}>, totalSize: number}>
 */
export async function getImageStats(): Promise<{
  files: Array<{name: string, size: number, age: number, ageHours: number}>,
  totalSize: number,
  totalFiles: number
}> {
  const publicDir = path.join(process.cwd(), 'public');
  const patterns = [
    'gemini-image-*.png',
    'fashion-tryOn-*.png', 
    'product-image-*.png'
  ];

  const result = {
    files: [] as Array<{name: string, size: number, age: number, ageHours: number}>,
    totalSize: 0,
    totalFiles: 0
  };

  try {
    const files = fs.readdirSync(publicDir);
    const now = Date.now();

    for (const file of files) {
      const matchesPattern = patterns.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(file);
      });

      if (!matchesPattern) continue;

      const filePath = path.join(publicDir, file);
      
      try {
        const stats = fs.statSync(filePath);
        const age = now - stats.mtime.getTime();
        const ageHours = age / (1000 * 60 * 60);

        result.files.push({
          name: file,
          size: stats.size,
          age: age,
          ageHours: Math.round(ageHours * 100) / 100
        });

        result.totalSize += stats.size;
        result.totalFiles++;
      } catch (fileError) {
        console.error(`Error reading file ${file}:`, fileError);
      }
    }

    // Sort by age (oldest first)
    result.files.sort((a, b) => b.age - a.age);

  } catch (error) {
    console.error('Error getting image stats:', error);
  }

  return result;
}