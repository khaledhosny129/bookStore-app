const reportService = require('../services/reportService');
const pdfGenerator = require('../utils/pdfGenerator');

const downloadStoreReport = async (req, res) => {
  try {
    const storeId = parseInt(req.params.id, 10);

    if (isNaN(storeId)) {
      return res.status(400).json({
        error: 'Invalid store ID',
        message: 'Store ID must be a valid number'
      });
    }

    const reportData = await reportService.getStoreReportData(storeId);

    if (!reportData) {
      return res.status(404).json({
        error: 'Store not found',
        message: `Store with ID ${storeId} does not exist`
      });
    }

    const pdfBuffer = await pdfGenerator.generatePDF({
      storeName: reportData.store.name,
      storeAddress: reportData.store.address,
      reportDate: reportData.reportDate,
      topBooks: reportData.topBooks,
      topAuthors: reportData.topAuthors
    });

    const filename = pdfGenerator.generateFilename(reportData.store.name);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating store report:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate store report',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  downloadStoreReport
};
