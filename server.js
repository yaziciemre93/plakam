const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Static dosyaları serve et
app.use(express.static('public'));

// Ana route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
}); 