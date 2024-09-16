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
