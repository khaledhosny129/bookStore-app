const { Store, Author, Book, StoreBook } = require('../models');
const { parseCSVFile } = require('../utils/csvParser');
const fs = require('fs');
const path = require('path');

const processRecord = async (record) => {
  try {
    const [store] = await Store.findOrCreate({
      where: {
        name: record.store_name,
        address: record.store_address
      },
      defaults: {
        name: record.store_name,
        address: record.store_address
      }
    });

    const [author] = await Author.findOrCreate({
      where: {
        name: record.author_name
      },
      defaults: {
        name: record.author_name
      }
    });

    const [book] = await Book.findOrCreate({
      where: {
        name: record.book_name,
        pages: record.pages,
        authorId: author.id
      },
      defaults: {
        name: record.book_name,
        pages: record.pages,
        authorId: author.id
      }
    });

    const [storeBook, created] = await StoreBook.findOrCreate({
      where: {
        storeId: store.id,
        bookId: book.id
      },
      defaults: {
        storeId: store.id,
        bookId: book.id,
        price: record.price,
        copies: 1,
        soldOut: false
      }
    });

    if (!created) {
      await storeBook.increment('copies', { by: 1 });
      await storeBook.reload();
      if (storeBook.price !== record.price) {
        await storeBook.update({ price: record.price });
        await storeBook.reload();
      }
    }

    return {
      success: true,
      store: store.name,
      book: book.name,
      author: author.name,
      action: created ? 'created' : 'updated',
      copies: storeBook.copies
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      record: record
    };
  }
};

const uploadInventory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please upload a CSV file'
      });
    }

    const filePath = req.file.path;

    let parseResult;
    try {
      parseResult = await parseCSVFile(filePath);
    } catch (parseError) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'CSV parsing failed',
        message: parseError.message
      });
    }

    const { records, errors: parseErrors } = parseResult;

    if (records.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'No valid records found',
        message: 'CSV file contains no valid data',
        errors: parseErrors
      });
    }

    const results = [];
    const processErrors = [];

    for (const record of records) {
      const result = await processRecord(record);
      if (result.success) {
        results.push(result);
      } else {
        processErrors.push(result);
      }
    }

    try {
      fs.unlinkSync(filePath);
    } catch (unlinkError) {
      console.error('Error deleting uploaded file:', unlinkError);
    }

    const response = {
      message: 'Inventory processed successfully',
      summary: {
        totalRecords: records.length,
        successful: results.length,
        failed: processErrors.length,
        parseErrors: parseErrors.length
      },
      results: results
    };

    if (parseErrors.length > 0 || processErrors.length > 0) {
      response.errors = {
        parseErrors: parseErrors,
        processErrors: processErrors
      };
    }

    const statusCode = processErrors.length === 0 && parseErrors.length === 0 
      ? 200 
      : 207;

    res.status(statusCode).json(response);

  } catch (error) {
    console.error('Error processing inventory upload:', error);
    
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process inventory upload',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  uploadInventory
};

