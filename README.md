# Bookstore App

A digital bookstore inventory synchronization and reporting system built with Node.js and Express. This application provides CSV-based inventory management and PDF report generation for bookstore analytics.

## Features

- **CSV Inventory Upload**: Upload and process CSV files to synchronize bookstore inventory
- **Smart Upsert Logic**: Automatically matches existing stores, books, and authors or creates new entities
- **Copy Management**: Increments book copies when store-book combinations already exist
- **PDF Report Generation**: Generate professional PDF reports with top 5 priciest books and prolific authors
- **HTML Template-based PDFs**: Beautiful, styled PDF reports using Handlebars templates
- **RESTful API**: Clean, well-structured API endpoints
- **PostgreSQL Database**: Robust relational database with Sequelize ORM
- **Error Handling**: Comprehensive validation and error handling

## Tech Stack

- **Runtime**: Node.js (v24+)
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL (v12+)
- **File Processing**: Multer, CSV-Parser
- **PDF Generation**: html-pdf-node, Handlebars
- **Template Engine**: Handlebars

## Project Structure

```
bookstore-app/
├── src/
│   ├── config/          # Database and app configuration
│   │   ├── database.js  # Sequelize database configuration
│   │   └── multer.js    # File upload configuration
│   ├── controllers/     # Request handlers
│   │   ├── inventoryController.js
│   │   └── storeController.js
│   ├── models/          # Sequelize models
│   │   ├── Author.js
│   │   ├── Book.js
│   │   ├── Store.js
│   │   ├── StoreBook.js
│   │   └── index.js
│   ├── routes/          # API routes
│   │   ├── inventoryRoutes.js
│   │   └── storeRoutes.js
│   ├── services/        # Business logic layer
│   │   └── reportService.js
│   ├── middleware/      # Custom middleware
│   │   └── uploadValidation.js
│   ├── templates/       # HTML templates
│   │   └── storeReport.html
│   ├── utils/           # Utility functions
│   │   ├── csvParser.js
│   │   ├── databaseSync.js
│   │   └── pdfGenerator.js
│   └── index.js         # Application entry point
├── uploads/             # Temporary CSV uploads (auto-cleaned)
├── reports/             # Generated PDF reports (if saved)
├── .env                 # Environment variables (not in repo)
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v24 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/khaledhosny129/bookStore-app.git
cd bookstore-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up PostgreSQL database:**
```sql
CREATE DATABASE bookstore_db;
```

4. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookstore_db
DB_USER=postgres
DB_PASSWORD=your_password

# Optional: Set to 'true' to see SQL queries in console
DB_LOGGING=false
```

5. **Start the development server:**
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Health Check

- **GET** `/` - API status
- **GET** `/health` - Health check endpoint

### Inventory Upload

**POST** `/api/inventory/upload`

Upload and process a CSV file to synchronize bookstore inventory.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with field name `file` containing the CSV file

**CSV Format:**
```csv
store_name,store_address,book_name,pages,author_name,price
BookWorld,123 Main Street,The Great Gatsby,180,F. Scott Fitzgerald,12.99
ReadMore,456 Oak Avenue,1984,328,George Orwell,13.75
```

**CSV Requirements:**
- Header row: `store_name,store_address,book_name,pages,author_name,price`
- All fields are required
- `pages` must be a positive integer
- `price` must be a non-negative number
- Empty rows are automatically skipped

**Response:**
```json
{
  "message": "Inventory processed successfully",
  "summary": {
    "totalRecords": 6,
    "successful": 6,
    "failed": 0,
    "parseErrors": 0
  },
  "results": [
    {
      "success": true,
      "store": "BookWorld",
      "book": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "action": "created",
      "copies": 1
    }
  ]
}
```

**Example using cURL:**
```bash
curl -X POST http://localhost:3000/api/inventory/upload \
  -F "file=@sample-inventory.csv"
```

**Example using Postman:**
1. Method: POST
2. URL: `http://localhost:3000/api/inventory/upload`
3. Body: form-data
4. Key: `file` (type: File)
5. Value: Select your CSV file

### Store Reports

**GET** `/api/store/:id/download-report`

Generate and download a PDF report for a specific store.

**Parameters:**
- `id` (path parameter): Store ID (integer)

**Response:**
- Content-Type: `application/pdf`
- File download with filename: `[Store-Name]-Report-YYYY-MM-DD.pdf`

**PDF Content:**
- Store information (name, address, generation date)
- **Top 5 Priciest Books**: Books with highest prices in the store
- **Top 5 Prolific Authors**: Authors with the most available books (by book count)

**Example:**
```bash
curl -X GET http://localhost:3000/api/store/1/download-report \
  --output report.pdf
```

**Error Responses:**
- `400`: Invalid store ID
- `404`: Store not found
- `500`: Internal server error

## Database Schema

### Tables

- **stores**: `id`, `name`, `address`, `created_at`, `updated_at`
- **authors**: `id`, `name`, `created_at`, `updated_at`
- **books**: `id`, `name`, `pages`, `author_id`, `created_at`, `updated_at`
- **store_books**: `id`, `store_id`, `book_id`, `price`, `copies`, `sold_out`, `created_at`, `updated_at`

### Relationships

- Author → Book (One-to-Many)
- Store ↔ Book (Many-to-Many through StoreBook)

## How It Works

### CSV Upload Process

1. **File Validation**: Validates CSV format and file type
2. **CSV Parsing**: Parses CSV file and validates each record
3. **Upsert Logic**:
   - Finds or creates Store (by name + address)
   - Finds or creates Author (by name)
   - Finds or creates Book (by name, pages, author)
   - Finds or creates StoreBook (by store + book)
   - If StoreBook exists, increments copies and updates price
4. **Response**: Returns summary of processed records

### PDF Report Generation

1. **Data Retrieval**:
   - Fetches store information
   - Queries top 5 priciest books (ordered by price DESC)
   - Queries top 5 prolific authors (by distinct book count)
2. **Template Rendering**: Uses Handlebars to render HTML template
3. **PDF Generation**: Converts HTML to PDF using html-pdf-node
4. **File Download**: Streams PDF directly to client

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon (auto-reload)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `bookstore_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_LOGGING` | Enable SQL query logging | `false` |

## Sample CSV Files

The repository includes sample CSV files for testing:
- `sample-inventory.csv` - Basic sample data
- `test-inventory-upsert.csv` - Tests upsert and copy incrementing
- `test-empty-rows.csv` - Tests empty row handling
- `final-test-inventory.csv` - Comprehensive test data (96 records)

## Error Handling

The API includes comprehensive error handling:
- Invalid file types
- Missing required fields
- Invalid data types
- Database connection errors
- Store not found errors
- CSV parsing errors

All errors return appropriate HTTP status codes with descriptive error messages.

## License

ISC

## Author

Developed as part of a backend coding challenge.
