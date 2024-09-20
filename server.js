const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;


app.use('/Music', express.static(path.join(__dirname, 'Music')));
app.use('/GIFs', express.static(path.join(__dirname, 'GIFs')));

// Endpoint 
app.get('/songs', (req, res) => {
    const musicDir = path.join(__dirname, 'Music');
    fs.readdir(musicDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to list files' });
        }

        // Filter
        const songs = files.filter(file => file.endsWith('.mp3')).map(file => ({
            title: path.basename(file, '.mp3'),
            url: `/Music/${file}`
        }));

        res.json(songs);
    });
});

// Endpoint
app.get('/gifs', (req, res) => {
    const gifDir = path.join(__dirname, 'GIFs');
    fs.readdir(gifDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to list GIFs' });
        }

        // Filter 
        const gifs = files.filter(file => file.endsWith('.gif')).map(file => ({
            filename: file,
            url: `/GIFs/${file}`
        }));

        res.json(gifs);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the Music directory
app.use('/Music', express.static(path.join(__dirname, 'Music')));

app.get('/songs', (req, res) => {
    const musicDir = path.join(__dirname, 'Music');
    fs.readdir(musicDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to list files' });
        }

        // Filter out non-mp3 files
        const songs = files.filter(file => file.endsWith('.mp3')).map(file => ({
            title: path.basename(file, '.mp3'),
            url: `/Music/${file}`
        }));

        res.json(songs);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
