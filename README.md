# Bookstore App

A digital bookstore inventory synchronization and reporting system built with Node.js and Express.

## Features

- CSV-based inventory upsert API
- PDF report generator for store analytics
- RESTful API endpoints
- PostgreSQL database with Sequelize ORM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: PostgreSQL
- **File Processing**: Multer, CSV-Parser
- **PDF Generation**: PDFKit

## Project Structure

```
bookstore-app/
├── src/
│   ├── config/       # Database and app configuration
│   ├── controllers/  # Request handlers
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   ├── utils/        # Utility functions
│   └── index.js      # Application entry point
├── .env.example      # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v24 or higher)
- PostgreSQL (v12 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/khaledhosny129/bookStore-app.git
cd bookstore-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Inventory Upload
- **POST** `/api/inventory/upload` - Upload and process CSV inventory file

### Store Reports
- **GET** `/api/store/:id/download-report` - Generate and download PDF report for a store

## Development

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## License

ISC

