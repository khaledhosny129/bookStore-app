const Author = require('./Author');
const Store = require('./Store');
const Book = require('./Book');
const StoreBook = require('./StoreBook');


Author.hasMany(Book, {
  foreignKey: 'authorId',
  as: 'books'
});

Book.belongsTo(Author, {
  foreignKey: 'authorId',
  as: 'author'
});

Store.belongsToMany(Book, {
  through: StoreBook,
  foreignKey: 'storeId',
  otherKey: 'bookId',
  as: 'books'
});

Book.belongsToMany(Store, {
  through: StoreBook,
  foreignKey: 'bookId',
  otherKey: 'storeId',
  as: 'stores'
});

StoreBook.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'store'
});

StoreBook.belongsTo(Book, {
  foreignKey: 'bookId',
  as: 'book'
});

Store.hasMany(StoreBook, {
  foreignKey: 'storeId',
  as: 'storeBooks'
});

Book.hasMany(StoreBook, {
  foreignKey: 'bookId',
  as: 'storeBooks'
});

module.exports = {
  Author,
  Store,
  Book,
  StoreBook,
  sequelize: require('../config/database')
};

