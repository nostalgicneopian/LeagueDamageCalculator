const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get all items
app.get('/api/items', (req, res) => {
  try {
    const itemsData = fs.readFileSync(path.join(__dirname, 'data', 'items.json'), 'utf8');
    const items = JSON.parse(itemsData);
    res.json(items);
  } catch (error) {
    console.error('Error reading items data:', error);
    res.status(500).json({ error: 'Failed to fetch items data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});