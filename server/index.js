const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const BACKUP_DIR = path.join(__dirname, 'data', 'backups');

// Enhanced CORS configuration for network access
app.use(cors({
  origin: '*', // Allow all origins for network access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Increase limit for large JSON files
app.use(express.urlencoded({ extended: true }));

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  // Ensure backup directory exists
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

// Create backup before writing
async function createBackup() {
  try {
    await ensureDataDir();
    if (fsSync.existsSync(DATA_FILE)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(BACKUP_DIR, `products-backup-${timestamp}.json`);
      await fs.copyFile(DATA_FILE, backupFile);
      // Keep only last 10 backups
      const backups = await fs.readdir(BACKUP_DIR);
      if (backups.length > 10) {
        backups.sort();
        for (let i = 0; i < backups.length - 10; i++) {
          await fs.unlink(path.join(BACKUP_DIR, backups[i]));
        }
      }
    }
  } catch (error) {
    console.error('Backup failed (non-critical):', error.message);
  }
}

// Normalize product payload to ensure required defaults persist
function normalizeProductPayload(payload = {}, fallback = {}) {
  const normalized = {
    ...fallback,
    ...payload,
  }

  normalized.type = payload.type || fallback.type || 'hcard'
  normalized.cardSize = payload.cardSize
    ? String(payload.cardSize)
    : fallback.cardSize || '40'

  return normalized
}

// Read products from JSON file
async function readProducts() {
  try {
    await ensureDataDir();
    
    // Check if file exists
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File doesn't exist, create default structure
      const defaultData = { shelves: [] };
      await writeProducts(defaultData);
      return defaultData;
    }
    
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    
    // Validate structure
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON structure');
    }
    if (!Array.isArray(parsed.shelves)) {
      parsed.shelves = [];
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading products:', error.message);
    // Return default structure on error
    return { shelves: [] };
  }
}

// Write products to JSON file with atomic write and backup
async function writeProducts(data) {
  const timestamp = new Date().toISOString();
  console.log(`\n`);
  console.log(`========================================================`);
  console.log(`📝 STARTING SAVE OPERATION`);
  console.log(`   Time: ${timestamp}`);
  console.log(`========================================================`);
  
  try {
    await ensureDataDir();
    console.log(`📁 Data directory ensured`);
    
    // Create backup before writing
    console.log(`💾 Creating backup...`);
    await createBackup();
    console.log(`✅ Backup created`);
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data structure');
    }
    if (!Array.isArray(data.shelves)) {
      data.shelves = [];
    }
    
    const totalProducts = data.shelves.reduce((sum, shelf) => sum + (shelf.items?.length || 0), 0);
    console.log(`📊 Data stats: ${data.shelves.length} shelves, ${totalProducts} products`);
    
    // Atomic write: write to temp file first, then rename
    const tempFile = DATA_FILE + '.tmp';
    const jsonString = JSON.stringify(data, null, 2);
    const fileSize = Buffer.byteLength(jsonString, 'utf8');
    console.log(`💾 Writing ${(fileSize / 1024).toFixed(2)} KB to temporary file...`);
    
    // Write to temporary file
    await fs.writeFile(tempFile, jsonString, 'utf8');
    console.log(`✅ Temporary file written`);
    
    // Atomic rename (works on most systems)
    await fs.rename(tempFile, DATA_FILE);
    console.log(`✅ File renamed (atomic write complete)`);
    
    // Verify the file was written
    const stats = await fs.stat(DATA_FILE);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`✅ File verified: ${fileSizeKB} KB`);
    
    // Read back and verify content
    const verifyData = await fs.readFile(DATA_FILE, 'utf8');
    const verifyParsed = JSON.parse(verifyData);
    const verifyProducts = verifyParsed.shelves.reduce((sum, shelf) => sum + (shelf.items?.length || 0), 0);
    
    const filePathShort = DATA_FILE.length > 50 ? '...' + DATA_FILE.slice(-47) : DATA_FILE;
    
    console.log(``);
    console.log(`========================================================`);
    console.log(`   ✅✅✅ DATA SAVED SUCCESSFULLY ✅✅✅`);
    console.log(`========================================================`);
    console.log(`   File: ${filePathShort}`);
    console.log(`   Size: ${fileSizeKB} KB`);
    console.log(`   Shelves: ${data.shelves.length}`);
    console.log(`   Products: ${totalProducts}`);
    console.log(`   Verified: ${verifyParsed.shelves.length} shelves, ${verifyProducts} products`);
    console.log(`   Time: ${timestamp}`);
    console.log(`========================================================`);
    console.log(``);
    
    return true;
  } catch (error) {
    console.error(`\n❌❌❌ ERROR WRITING DATA ❌❌❌`);
    console.error(`   Time: ${timestamp}`);
    console.error(`   Error: ${error.message}`);
    console.error(`   Stack: ${error.stack}\n`);
    
    // Try to restore from backup if write failed
    try {
      const backups = await fs.readdir(BACKUP_DIR);
      if (backups.length > 0) {
        backups.sort().reverse();
        const latestBackup = path.join(BACKUP_DIR, backups[0]);
        console.log('⚠️  Attempting to restore from backup...');
        await fs.copyFile(latestBackup, DATA_FILE);
        console.log('✅ Restored from backup');
      }
    } catch (restoreError) {
      console.error('❌ Failed to restore from backup:', restoreError);
    }
    throw error;
  }
}

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const data = await readProducts();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
app.get('/api/products/:shelfId/:productId', async (req, res) => {
  try {
    const { shelfId, productId } = req.params;
    const data = await readProducts();
    const shelf = data.shelves.find(s => s.id === shelfId);
    if (!shelf) {
      return res.status(404).json({ error: 'Shelf not found' });
    }
    const product = shelf.items.find(item => item.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
app.post('/api/products/:shelfId', async (req, res) => {
  try {
    const { shelfId } = req.params;
    const product = req.body;
    
    // Validate product data
    if (!product.id || !product.title) {
      return res.status(400).json({ error: 'Product ID and title are required' });
    }
    
    const data = await readProducts();
    const shelf = data.shelves.find(s => s.id === shelfId);
    if (!shelf) {
      return res.status(404).json({ error: 'Shelf not found' });
    }
    
    // Ensure items array exists
    if (!shelf.items) {
      shelf.items = [];
    }
    
    // Check for duplicate ID
    if (shelf.items.find(item => item.id === product.id)) {
      return res.status(400).json({ error: 'Product with this ID already exists' });
    }
    
    const normalizedProduct = normalizeProductPayload(product)
    shelf.items.push(normalizedProduct);
    console.log(`\n`);
    console.log(`🔄🔄🔄 CREATING PRODUCT 🔄🔄🔄`);
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Shelf ID: ${shelfId}`);
    console.log(`   Title: ${product.title}`);
    await writeProducts(data);
    console.log(`✅✅✅ PRODUCT CREATED AND SAVED ✅✅✅`);
    console.log(`   Product: ${product.id} in shelf ${shelfId}\n`);
    res.json({ ...normalizedProduct, _saved: true, _message: 'Product created and saved successfully' });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});

// Update product
app.put('/api/products/:shelfId/:productId', async (req, res) => {
  try {
    const { shelfId, productId } = req.params;
    const updatedProduct = req.body;
    
    // Ensure product ID matches
    updatedProduct.id = productId;
    
    const data = await readProducts();
    const shelf = data.shelves.find(s => s.id === shelfId);
    if (!shelf) {
      return res.status(404).json({ error: 'Shelf not found' });
    }
    
    if (!shelf.items) {
      shelf.items = [];
    }
    
    const index = shelf.items.findIndex(item => item.id === productId);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const normalizedProduct = normalizeProductPayload(updatedProduct, shelf.items[index])
    normalizedProduct.id = productId
    shelf.items[index] = normalizedProduct;
    console.log(`\n`);
    console.log(`🔄🔄🔄 UPDATING PRODUCT 🔄🔄🔄`);
    console.log(`   Product ID: ${productId}`);
    console.log(`   Shelf ID: ${shelfId}`);
    await writeProducts(data);
    console.log(`✅✅✅ PRODUCT UPDATED AND SAVED ✅✅✅`);
    console.log(`   Product: ${productId} in shelf ${shelfId}\n`);
    res.json({ ...normalizedProduct, _saved: true, _message: 'Product updated and saved successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message || 'Failed to update product' });
  }
});

// Delete product
app.delete('/api/products/:shelfId/:productId', async (req, res) => {
  try {
    const { shelfId, productId } = req.params;
    const data = await readProducts();
    const shelf = data.shelves.find(s => s.id === shelfId);
    if (!shelf) {
      return res.status(404).json({ error: 'Shelf not found' });
    }
    
    if (!shelf.items) {
      shelf.items = [];
    }
    
    const initialLength = shelf.items.length;
    shelf.items = shelf.items.filter(item => item.id !== productId);
    
    if (shelf.items.length === initialLength) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    console.log(`\n`);
    console.log(`🔄🔄🔄 DELETING PRODUCT 🔄🔄🔄`);
    console.log(`   Product ID: ${productId}`);
    console.log(`   Shelf ID: ${shelfId}`);
    await writeProducts(data);
    console.log(`✅✅✅ PRODUCT DELETED AND SAVED ✅✅✅`);
    console.log(`   Product: ${productId} from shelf ${shelfId}\n`);
    res.json({ success: true, _saved: true, _message: 'Product deleted and saved successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message || 'Failed to delete product' });
  }
});

// Get all shelves
app.get('/api/shelves', async (req, res) => {
  try {
    const data = await readProducts();
    res.json(data.shelves || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create shelf
app.post('/api/shelves', async (req, res) => {
  try {
    const shelf = req.body;
    
    // Validate shelf data
    if (!shelf.id || !shelf.title) {
      return res.status(400).json({ error: 'Shelf ID and title are required' });
    }
    
    const data = await readProducts();
    if (!data.shelves) data.shelves = [];
    
    // Check for duplicate ID
    if (data.shelves.find(s => s.id === shelf.id)) {
      return res.status(400).json({ error: 'Shelf with this ID already exists' });
    }
    
    // Ensure items array exists
    if (!shelf.items) {
      shelf.items = [];
    }
    
    data.shelves.push(shelf);
    console.log(`\n`);
    console.log(`🔄🔄🔄 CREATING SHELF 🔄🔄🔄`);
    console.log(`   Shelf ID: ${shelf.id}`);
    console.log(`   Title: ${shelf.title}`);
    await writeProducts(data);
    console.log(`✅✅✅ SHELF CREATED AND SAVED ✅✅✅`);
    console.log(`   Shelf: ${shelf.id} - ${shelf.title}\n`);
    res.json({ ...shelf, _saved: true, _message: 'Shelf created and saved successfully' });
  } catch (error) {
    console.error('Error creating shelf:', error);
    res.status(500).json({ error: error.message || 'Failed to create shelf' });
  }
});

// Update shelf
app.put('/api/shelves/:shelfId', async (req, res) => {
  try {
    const { shelfId } = req.params;
    const updatedShelf = req.body;
    
    // Ensure ID matches
    updatedShelf.id = shelfId;
    
    // Ensure items array exists
    if (!updatedShelf.items) {
      updatedShelf.items = [];
    }
    
    const data = await readProducts();
    const index = data.shelves.findIndex(s => s.id === shelfId);
    if (index === -1) {
      return res.status(404).json({ error: 'Shelf not found' });
    }
    
    data.shelves[index] = updatedShelf;
    console.log(`\n`);
    console.log(`🔄🔄🔄 UPDATING SHELF 🔄🔄🔄`);
    console.log(`   Shelf ID: ${shelfId}`);
    console.log(`   Title: ${updatedShelf.title}`);
    await writeProducts(data);
    console.log(`✅✅✅ SHELF UPDATED AND SAVED ✅✅✅`);
    console.log(`   Shelf: ${shelfId} - ${updatedShelf.title}\n`);
    res.json({ ...updatedShelf, _saved: true, _message: 'Shelf updated and saved successfully' });
  } catch (error) {
    console.error('Error updating shelf:', error);
    res.status(500).json({ error: error.message || 'Failed to update shelf' });
  }
});

// Delete shelf
app.delete('/api/shelves/:shelfId', async (req, res) => {
  try {
    const { shelfId } = req.params;
    const data = await readProducts();
    
    const initialLength = data.shelves.length;
    data.shelves = data.shelves.filter(s => s.id !== shelfId);
    
    if (data.shelves.length === initialLength) {
      return res.status(404).json({ error: 'Shelf not found' });
    }
    
    console.log(`\n`);
    console.log(`🔄🔄🔄 DELETING SHELF 🔄🔄🔄`);
    console.log(`   Shelf ID: ${shelfId}`);
    await writeProducts(data);
    console.log(`✅✅✅ SHELF DELETED AND SAVED ✅✅✅`);
    console.log(`   Shelf: ${shelfId}\n`);
    res.json({ success: true, _saved: true, _message: 'Shelf deleted and saved successfully' });
  } catch (error) {
    console.error('Error deleting shelf:', error);
    res.status(500).json({ error: error.message || 'Failed to delete shelf' });
  }
});

// Import data from shelvesData.js
app.post('/api/import', async (req, res) => {
  try {
    const fsSync = require('fs');
    const path = require('path');
    const shelvesDataPath = path.join(__dirname, '..', 'src', 'data', 'shelvesData.js');
    
    // Read the shelvesData.js file
    const content = fsSync.readFileSync(shelvesDataPath, 'utf8');
    
    // Extract the shelvesData array using regex
    const match = content.match(/export const shelvesData = (\[[\s\S]*\]);/);
    if (!match) {
      return res.status(400).json({ error: 'Could not parse shelvesData.js' });
    }
    
    // Evaluate the array (safe in this context as it's our own file)
    const shelvesData = eval(match[1]);
    
    // Convert to the format expected by the server
    const data = {
      shelves: shelvesData.map(shelf => ({
        id: shelf.id,
        title: shelf.title,
        secondaryTitle: shelf.secondaryTitle,
        items: shelf.items || []
      }))
    };
    
    // Write to JSON file
    console.log(`\n🔄 Importing data: ${data.shelves.length} shelves`);
    await writeProducts(data);
    console.log(`✅ Data imported and saved: ${data.shelves.length} shelves`);
    res.json({ success: true, _saved: true, message: `Imported ${data.shelves.length} shelves and saved successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const data = await readProducts();
    const stats = fsSync.existsSync(DATA_FILE) ? fsSync.statSync(DATA_FILE) : null;
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      dataFile: DATA_FILE,
      fileExists: fsSync.existsSync(DATA_FILE),
      fileSize: stats ? `${(stats.size / 1024).toFixed(2)} KB` : 'N/A',
      lastModified: stats ? stats.mtime.toISOString() : 'N/A',
      shelvesCount: data.shelves.length,
      totalProducts: data.shelves.reduce((sum, shelf) => sum + (shelf.items?.length || 0), 0)
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      error: error.message 
    });
  }
});

// Test write endpoint (for debugging)
app.post('/api/test-write', async (req, res) => {
  try {
    console.log('\n🧪 TEST WRITE REQUEST RECEIVED');
    const data = await readProducts();
    console.log('🧪 Current data loaded');
    await writeProducts(data);
    console.log('🧪 Test write completed');
    res.json({ 
      success: true, 
      message: 'Test write completed - check server console for logs',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🧪 Test write failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Instagram feed cache
let instagramCache = {
  timestamp: 0,
  data: [],
  error: null
};

// Instagram Basic Display API endpoint
app.get('/api/instagram', async (req, res) => {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.warn('⚠️  Instagram access token not configured');
      return res.status(503).json({ 
        error: 'Instagram feed not configured',
        message: 'Please set INSTAGRAM_ACCESS_TOKEN environment variable'
      });
    }

    // Cache duration: 15 minutes (900 seconds)
    const cacheDuration = (process.env.INSTAGRAM_CACHE_SECONDS || 900) * 1000;
    const now = Date.now();

    // Return cached data if still valid
    if (instagramCache.data.length > 0 && 
        now - instagramCache.timestamp < cacheDuration && 
        !instagramCache.error) {
      console.log('📸 Returning cached Instagram posts');
      return res.json(instagramCache.data);
    }

    // Fetch from Instagram API
    console.log('📸 Fetching Instagram posts from API...');
    
    const fields = [
      'id',
      'caption',
      'media_url',
      'thumbnail_url',
      'permalink',
      'media_type',
      'timestamp',
      'like_count',
      'comments_count'
    ].join(',');

    const limit = parseInt(process.env.INSTAGRAM_POST_LIMIT || '8', 10);

    const response = await axios.get('https://graph.instagram.com/me/media', {
      params: {
        fields,
        access_token: accessToken,
        limit
      },
      timeout: 10000 // 10 second timeout
    });

    // Process and format the posts
    const posts = response.data.data.map(post => ({
      id: post.id,
      caption: post.caption || '',
      media_url: post.media_type === 'VIDEO' 
        ? (post.thumbnail_url || post.media_url)
        : post.media_url,
      permalink: post.permalink,
      media_type: post.media_type,
      timestamp: post.timestamp,
      like_count: post.like_count || 0,
      comments_count: post.comments_count || 0
    }));

    // Update cache
    instagramCache = {
      timestamp: now,
      data: posts,
      error: null
    };

    console.log(`✅ Fetched ${posts.length} Instagram posts`);
    res.json(posts);

  } catch (error) {
    console.error('❌ Instagram API error:', error.response?.data || error.message);
    
    // Return cached data if available, even if expired
    if (instagramCache.data.length > 0) {
      console.log('⚠️  Returning expired cache due to API error');
      return res.json(instagramCache.data);
    }

    // Store error in cache to avoid repeated failed requests
    instagramCache.error = error.message;
    
    res.status(500).json({ 
      error: 'Failed to fetch Instagram posts',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize data file on startup
async function initializeServer() {
  try {
    await ensureDataDir();
    const data = await readProducts();
    console.log(`📦 Loaded ${data.shelves.length} shelves from ${DATA_FILE}`);
    
    // If no data exists, create default structure
    if (data.shelves.length === 0) {
      await writeProducts({ shelves: [] });
      console.log('📝 Created empty data file');
    }
  } catch (error) {
    console.error('❌ Error initializing server:', error);
  }
}

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let localIP = 'localhost';
  
  // Find the first non-internal IPv4 address
  for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName];
    for (const address of addresses) {
      if (address.family === 'IPv4' && !address.internal) {
        localIP = address.address;
        break;
      }
    }
    if (localIP !== 'localhost') break;
  }
  
  // Initialize data
  await initializeServer();
  
  console.log(`\n🚀 Server running!`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${localIP}:${PORT}`);
  console.log(`   Data:    ${DATA_FILE}`);
  console.log(`   CORS:    Enabled for all origins\n`);
});

