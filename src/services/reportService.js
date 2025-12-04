const { Store, StoreBook, Book, Author } = require('../models');

class ReportService {
  async getTopPriciestBooks(storeId, limit = 5) {
    const topBooks = await StoreBook.findAll({
      where: {
        storeId: storeId,
        soldOut: false
      },
      include: [
        {
          model: Book,
          as: 'book',
          include: [
            {
              model: Author,
              as: 'author',
              attributes: ['name']
            }
          ],
          attributes: ['name']
        }
      ],
      attributes: ['price', 'copies'],
      order: [['price', 'DESC']],
      limit: limit
    });

    return topBooks.map(sb => ({
      name: sb.book.name,
      authorName: sb.book.author.name,
      price: parseFloat(sb.price).toFixed(2),
      copies: sb.copies
    }));
  }

  async getTopProlificAuthors(storeId, limit = 5) {
    const topAuthorsData = await StoreBook.findAll({
      where: {
        storeId: storeId,
        soldOut: false
      },
      include: [
        {
          model: Book,
          as: 'book',
          include: [
            {
              model: Author,
              as: 'author',
              attributes: ['id', 'name']
            }
          ],
          attributes: ['id', 'name']
        }
      ],
      attributes: ['copies']
    });

    const authorStats = {};
    topAuthorsData.forEach(sb => {
      const authorId = sb.book.author.id;
      const authorName = sb.book.author.name;
      if (!authorStats[authorId]) {
        authorStats[authorId] = {
          id: authorId,
          name: authorName,
          totalBooks: 0,
          totalCopies: 0
        };
      }
      authorStats[authorId].totalBooks += 1;
      authorStats[authorId].totalCopies += sb.copies;
    });

    return Object.values(authorStats)
      .sort((a, b) => {
        if (b.totalBooks !== a.totalBooks) {
          return b.totalBooks - a.totalBooks;
        }
        return b.totalCopies - a.totalCopies;
      })
      .slice(0, limit);
  }

  async getStoreReportData(storeId) {
    const store = await Store.findByPk(storeId);
    
    if (!store) {
      return null;
    }

    const [topBooks, topAuthors] = await Promise.all([
      this.getTopPriciestBooks(storeId),
      this.getTopProlificAuthors(storeId)
    ]);

    return {
      store: {
        id: store.id,
        name: store.name,
        address: store.address
      },
      topBooks,
      topAuthors,
      reportDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  }
}

module.exports = new ReportService();

