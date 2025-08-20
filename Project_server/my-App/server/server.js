// server.js
const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the Angular dist folder
app.use(express.static(path.join(__dirname, 'dist/your-app-name')));

// Handle fallback for Angular routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/your-app-name/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});