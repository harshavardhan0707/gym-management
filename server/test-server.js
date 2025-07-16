const express = require('express');
const app = express();

// Test basic routes
app.get('/test', (req, res) => {
    res.json({ message: 'Test server working' });
});

// Simple catch-all route without wildcards
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
}); 