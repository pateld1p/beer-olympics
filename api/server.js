const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes for different pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html')); // Main page
});

app.get('/select_game', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'select_game.html')); // Select game page
});

app.get('/select_winner', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'select_winner.html')); // Select winner page
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
