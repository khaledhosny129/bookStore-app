const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StoreBook = sequelize.define('StoreBook', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'store_id',
    references: {
      model: 'stores',
      key: 'id'
    },
    validate: {
      isInt: true
    }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'book_id',
    references: {
      model: 'books',
      key: 'id'
    },
    validate: {
      isInt: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  copies: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: true,
      min: 0
    }
  },
  soldOut: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'sold_out'
  }
}, {
  tableName: 'store_books',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['store_id', 'book_id']
    }
  ]
});

module.exports = StoreBook;

