const validateCSVUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'No file provided',
      message: 'Please upload a CSV file'
    });
  }

  next();
};

module.exports = {
  validateCSVUpload
};

