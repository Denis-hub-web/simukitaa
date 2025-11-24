const fs = require('fs').promises;
const path = require('path');

// Read and parse the shelves data file
async function loadShelvesData() {
  const dataPath = path.join(__dirname, '..', 'src', 'data', 'shelvesData.js');
  const content = await fs.readFile(dataPath, 'utf8');
  // Extract the shelvesData export
  const match = content.match(/export const shelvesData = (\[[\s\S]*\]);/);
  if (match) {
    return eval(match[1]);
  }
  return [];
}

async function initData() {
  const dataDir = path.join(__dirname, 'data');
  const dataFile = path.join(dataDir, 'products.json');
  
  try {
    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });
    
    // Load shelves data
    const shelvesData = await loadShelvesData();
    
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
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
    console.log('✅ Data initialized successfully!');
    console.log(`📁 Data file: ${dataFile}`);
    console.log(`📊 Loaded ${data.shelves.length} shelves`);
  } catch (error) {
    console.error('❌ Error initializing data:', error);
  }
}

initData();

