# Shop Admin Setup

## Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Initialize data from existing shelves (optional):
```bash
node init-data.js
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001`

## Admin App Setup

1. Install react-router-dom (if not already installed):
```bash
npm install react-router-dom
```

2. Start the dev server:
```bash
npm run dev
```

3. Access the admin panel at:
```
http://localhost:5173/xyz-portal.html
```

4. **Import Existing Data**: Click the "Import Data" button in the admin panel to import all data from `src/data/shelvesData.js` into the JSON database.

## Important Notes

- **Frontend now uses API**: The main shop frontend (`src/App.jsx`) now fetches data from the API instead of using static imports
- **Data Source**: All data is managed through the admin panel and stored in `server/data/products.json`
- **Import Feature**: Use the "Import Data" button to load existing data from `shelvesData.js` into the admin system

## Features

- **Shelf Management**: Create, edit, and delete product shelves
- **Product Management**: Add, edit, and delete products within shelves
- **Import Data**: One-click import of existing data from `shelvesData.js`
- **Instagram-like UI**: Clean, modern interface similar to Instagram
- **JSON Storage**: All data stored in `server/data/products.json`
- **REST API**: Full CRUD operations via Express server
- **Frontend Integration**: Frontend automatically fetches data from API

## API Endpoints

- `GET /api/shelves` - Get all shelves
- `POST /api/shelves` - Create new shelf
- `PUT /api/shelves/:id` - Update shelf
- `DELETE /api/shelves/:id` - Delete shelf
- `GET /api/products/:shelfId/:productId` - Get product
- `POST /api/products/:shelfId` - Create product
- `PUT /api/products/:shelfId/:productId` - Update product
- `DELETE /api/products/:shelfId/:productId` - Delete product
- `POST /api/import` - Import data from shelvesData.js

## Data Structure

Data is stored in `server/data/products.json`:
```json
{
  "shelves": [
    {
      "id": "shelf-iphone",
      "title": "iPhone",
      "secondaryTitle": "The latest from Apple.",
      "items": [...]
    }
  ]
}
```

