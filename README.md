# Simukitaa Store

A modern e-commerce store built with React and Node.js, featuring an elegant product showcase and admin panel.

## Features

- 🛍️ **Product Showcase**: Beautiful, responsive product display with horizontal scrolling shelves
- 📱 **Multi-Brand Support**: iPhone, Samsung, Google Pixel, MacBook, HP, AirPods, JBL Speakers
- 🎨 **Modern UI**: Inspired by Apple's design language
- 🔧 **Admin Panel**: Full CRUD operations for managing products and shelves
- 📱 **WhatsApp Integration**: Direct WhatsApp chat links for product inquiries
- 🌐 **Network Access**: Access from any device on your local network
- 💾 **JSON Database**: Simple file-based storage (easy to migrate to a database)

## Tech Stack

- **Frontend**: React 19, Vite, React Router
- **Backend**: Node.js, Express.js
- **Storage**: JSON file-based (ready for database migration)
- **Styling**: CSS with Apple-inspired design

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Git (for deployment)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/simukitaa-store.git
   cd simukitaa-store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

3. **Start the backend server**:
   ```bash
   cd server
   npm start
   ```
   Server runs on `http://localhost:3001`

4. **Start the frontend** (in a new terminal):
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

5. **Access the application**:
   - Main Store: http://localhost:5173
   - Admin Panel: http://localhost:5173/xyz-portal.html

### Admin Access

- Default password is set in the admin login (check `src/admin/Login.jsx`)
- The admin panel allows you to:
  - Create and manage product shelves
  - Add, edit, and delete products
  - Upload product images
  - Import data from `src/data/shelvesData.js`

## Deployment

### Quick Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Recommended Setup:**
- **Frontend**: Deploy to [Vercel](https://vercel.com) (free)
- **Backend**: Deploy to [Render](https://render.com) (free tier available)

### Quick Deployment Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/simukitaa-store.git
   git push -u origin main
   ```

2. **Deploy Backend (Render)**:
   - Go to https://render.com
   - Connect GitHub repository
   - Create new Web Service from `server` directory
   - Get your backend URL

3. **Deploy Frontend (Vercel)**:
   - Go to https://vercel.com
   - Import GitHub repository
   - Add environment variable: `VITE_API_BASE_URL` = your Render backend URL
   - Deploy

4. **Access Your Store**:
   - Main store: Your Vercel URL
   - Admin: `https://your-vercel-url.vercel.app/xyz-portal.html`

## Project Structure

```
simukitaa-store/
├── src/                    # Frontend React application
│   ├── admin/             # Admin panel components
│   ├── components/        # Reusable React components
│   ├── data/              # Initial product data
│   └── App.jsx            # Main application component
├── server/                # Backend Express server
│   ├── data/              # JSON database files
│   └── index.js           # Express server entry point
├── public/                # Static assets
└── dist/                  # Production build (generated)
```

## API Endpoints

- `GET /api/shelves` - Get all product shelves
- `GET /api/products/:shelfId` - Get products in a shelf
- `POST /api/shelves` - Create a new shelf
- `POST /api/products/:shelfId` - Create a product
- `PUT /api/shelves/:shelfId` - Update a shelf
- `PUT /api/products/:shelfId/:productId` - Update a product
- `DELETE /api/shelves/:shelfId` - Delete a shelf
- `DELETE /api/products/:shelfId/:productId` - Delete a product
- `POST /api/import` - Import data from shelvesData.js

## Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

For production, set `VITE_API_BASE_URL` to your deployed backend URL.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for Simukitaa Store



