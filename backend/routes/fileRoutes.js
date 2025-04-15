const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../middlewares/multerConfig'); 
const path = require('path');

/**
 * File Upload & Metadata Routes
 */
// Upload a file
router.post('/upload', upload.single('file'), fileController.uploadFile);
// Get metadata and parsed data for a file
router.get('/files/:fileId', validateFileId, fileController.getParsedFileById);

/**
 * Block Routes
 */
// Get all blocks for a file (paginated)
router.get('/files/:fileId/blocks', validateFileId, fileController.getBlocks);
// Get details for a specific block
router.get('/blocks/:blockId', validateBlockId, fileController.getBlockById);
// Search/filter blocks for a file (paginated)
router.get('/files/:fileId/blocks/search', validateFileId, fileController.searchBlocks);

// --- Validation Middlewares ---
function validateFileId(req, res, next) {
  const { fileId } = req.params;
  if (!fileId || isNaN(Number(fileId))) {
    return res.status(400).json({ success: false, message: 'Invalid or missing fileId parameter.' });
  }
  next();
}
function validateBlockId(req, res, next) {
  const { blockId } = req.params;
  if (!blockId || isNaN(Number(blockId))) {
    return res.status(400).json({ success: false, message: 'Invalid or missing blockId parameter.' });
  }
  next();
}

module.exports = router;