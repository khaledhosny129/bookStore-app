const express = require('express');
const router = express.Router();
const { downloadStoreReport } = require('../controllers/storeController');

router.get('/:id/download-report', downloadStoreReport);

module.exports = router;

