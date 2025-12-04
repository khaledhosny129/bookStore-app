const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadInventory } = require('../controllers/inventoryController');
const { validateCSVUpload } = require('../middleware/uploadValidation');

router.post(
  '/upload',
  upload.single('file'),
  validateCSVUpload,
  uploadInventory
);

module.exports = router;

