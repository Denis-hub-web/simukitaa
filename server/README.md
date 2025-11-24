# Shop Admin Server

Express.js server for managing product shelves and items. All data is automatically saved to JSON file.

## Features

- ✅ **Auto-save**: All changes are automatically saved to `data/products.json`
- ✅ **Atomic writes**: Uses temporary files to prevent data corruption
- ✅ **Automatic backups**: Creates backups before each write (keeps last 10)
- ✅ **Network ready**: CORS enabled for all origins, listens on `0.0.0.0`
- ✅ **Data validation**: Validates all incoming data
- ✅ **Error recovery**: Automatically restores from backup on write failure
- ✅ **Health check**: `/api/health` endpoint for monitoring

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
npm start
```

Or with auto-reload (development):
```bash
npm run dev
```

## API Endpoints

### Shelves
- `GET /api/shelves` - Get all shelves
- `POST /api/shelves` - Create new shelf
- `PUT /api/shelves/:shelfId` - Update shelf
- `DELETE /api/shelves/:shelfId` - Delete shelf

### Products
- `GET /api/products/:shelfId/:productId` - Get single product
- `POST /api/products/:shelfId` - Create product in shelf
- `PUT /api/products/:shelfId/:productId` - Update product
- `DELETE /api/products/:shelfId/:productId` - Delete product

### Utilities
- `POST /api/import` - Import data from `src/data/shelvesData.js`
- `GET /api/health` - Health check endpoint

## Data Storage

- **Main file**: `server/data/products.json`
- **Backups**: `server/data/backups/` (last 10 backups kept)
- **Format**: JSON with structure:
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

## Network Access

The server listens on `0.0.0.0:3001` which allows access from:
- Localhost: `http://localhost:3001`
- Network devices: `http://YOUR_IP:3001`

CORS is enabled for all origins to allow network access.

## Backup System

- Automatic backups created before each write
- Stored in `server/data/backups/`
- Keeps last 10 backups
- Auto-restore on write failure

## Error Handling

- All operations validate data before saving
- Duplicate ID detection
- Automatic backup restoration on errors
- Detailed error logging to console

## Security Notes

⚠️ **For Production:**
- Change CORS origin from `*` to specific domains
- Add authentication/authorization
- Use HTTPS
- Implement rate limiting
- Add input sanitization



