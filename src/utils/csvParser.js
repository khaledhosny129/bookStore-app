const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');

const parseCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];
    let rowNumber = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        rowNumber++;
        const requiredFields = ['store_name', 'store_address', 'book_name', 'pages', 'author_name', 'price'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
        
        const isEmptyRow = requiredFields.every(field => !data[field] || data[field].trim() === '');

        if (isEmptyRow) {
          return;
        }

        if (missingFields.length > 0) {
          errors.push({
            row: rowNumber,
            error: `Missing required fields: ${missingFields.join(', ')}`,
            data: data
          });
        } else {
          const record = {
            store_name: data.store_name.trim(),
            store_address: data.store_address.trim(),
            book_name: data.book_name.trim(),
            pages: parseInt(data.pages, 10),
            author_name: data.author_name.trim(),
            price: parseFloat(data.price)
          };

          if (isNaN(record.pages) || record.pages <= 0) {
            errors.push({
              row: rowNumber,
              error: 'Invalid pages value. Must be a positive integer.',
              data: data
            });
          } else if (isNaN(record.price) || record.price < 0) {
            errors.push({
              row: rowNumber,
              error: 'Invalid price value. Must be a non-negative number.',
              data: data
            });
          } else {
            results.push(record);
          }
        }
      })
      .on('end', () => {
        if (errors.length > 0 && results.length === 0) {
          reject(new Error(`CSV parsing failed. ${errors.length} error(s) found.`));
        } else {
          resolve({ records: results, errors: errors });
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const parseCSVBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];
    let rowCount = 0;

    const stream = Readable.from(buffer.toString());
    
    stream
      .pipe(csv())
      .on('data', (data) => {
        rowCount++;
        const requiredFields = ['store_name', 'store_address', 'book_name', 'pages', 'author_name', 'price'];
        const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
        
        const isEmptyRow = requiredFields.every(field => !data[field] || data[field].trim() === '');

        if (isEmptyRow) {
          return;
        }

        if (missingFields.length > 0) {
          errors.push({
            row: rowCount,
            error: `Missing required fields: ${missingFields.join(', ')}`,
            data: data
          });
        } else {
          const record = {
            store_name: data.store_name.trim(),
            store_address: data.store_address.trim(),
            book_name: data.book_name.trim(),
            pages: parseInt(data.pages, 10),
            author_name: data.author_name.trim(),
            price: parseFloat(data.price)
          };

          if (isNaN(record.pages) || record.pages <= 0) {
            errors.push({
              row: rowCount,
              error: 'Invalid pages value. Must be a positive integer.',
              data: data
            });
          } else if (isNaN(record.price) || record.price < 0) {
            errors.push({
              row: rowCount,
              error: 'Invalid price value. Must be a non-negative number.',
              data: data
            });
          } else {
            results.push(record);
          }
        }
      })
      .on('end', () => {
        if (errors.length > 0 && results.length === 0) {
          reject(new Error(`CSV parsing failed. ${errors.length} error(s) found.`));
        } else {
          resolve({ records: results, errors: errors });
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = {
  parseCSVFile,
  parseCSVBuffer
};

