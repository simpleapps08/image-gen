import { NextApiRequest, NextApiResponse } from 'next';
import { cleanupOldImages, getImageStats } from '../../lib/cleanup';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get statistics about current images
      const stats = await getImageStats();
      
      return res.status(200).json({
        success: true,
        stats: {
          totalFiles: stats.totalFiles,
          totalSize: stats.totalSize,
          totalSizeKB: Math.round(stats.totalSize / 1024),
          totalSizeMB: Math.round(stats.totalSize / (1024 * 1024) * 100) / 100,
          files: stats.files.map(file => ({
            name: file.name,
            sizeKB: Math.round(file.size / 1024),
            ageHours: file.ageHours,
            canDelete: file.ageHours >= 24
          }))
        }
      });
    }

    if (req.method === 'POST') {
      // Perform cleanup
      const { 
        maxAgeHours = 24, 
        dryRun = false 
      } = req.body || {};

      // Validate maxAgeHours
      if (typeof maxAgeHours !== 'number' || maxAgeHours < 0) {
        return res.status(400).json({
          success: false,
          error: 'maxAgeHours must be a positive number'
        });
      }

      console.log(`Starting cleanup: maxAge=${maxAgeHours}h, dryRun=${dryRun}`);
      
      const result = await cleanupOldImages({
        maxAgeHours,
        dryRun
      });

      return res.status(200).json({
        success: true,
        cleanup: {
          deletedFiles: result.deletedFiles,
          totalDeleted: result.totalDeleted,
          totalSizeFreed: result.totalSize,
          totalSizeFreedKB: Math.round(result.totalSize / 1024),
          totalSizeFreedMB: Math.round(result.totalSize / (1024 * 1024) * 100) / 100,
          errors: result.errors,
          dryRun
        }
      });
    }

    if (req.method === 'DELETE') {
      // Force cleanup all generated images (admin only)
      const { confirm } = req.body || {};
      
      if (confirm !== 'DELETE_ALL_IMAGES') {
        return res.status(400).json({
          success: false,
          error: 'Missing confirmation. Send { "confirm": "DELETE_ALL_IMAGES" } to proceed.'
        });
      }

      console.log('Force cleanup: deleting all generated images');
      
      const result = await cleanupOldImages({
        maxAgeHours: 0, // Delete all files regardless of age
        dryRun: false
      });

      return res.status(200).json({
        success: true,
        cleanup: {
          deletedFiles: result.deletedFiles,
          totalDeleted: result.totalDeleted,
          totalSizeFreed: result.totalSize,
          totalSizeFreedKB: Math.round(result.totalSize / 1024),
          totalSizeFreedMB: Math.round(result.totalSize / (1024 * 1024) * 100) / 100,
          errors: result.errors,
          message: 'All generated images have been deleted'
        }
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET for stats, POST for cleanup, DELETE for force cleanup.'
    });

  } catch (error) {
    console.error('Cleanup API error:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}