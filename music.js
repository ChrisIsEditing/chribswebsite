let songs = [];
const keysPressed = new Set();

// Load songs from JSON
function loadSongs() {
    fetch('music_list.json')
        .then(response => response.json())
        .then(data => {
            songs = data.map(item => ({
                title: item.name.replace('.mp3', ''),
                url: item.url
            }));
            console.log(songs);
        })
        .catch(error => console.error('Error loading songs:', error));
}

document.addEventListener('DOMContentLoaded', loadSongs);

// Play random song
function playRandomSong() {
    if (songs.length === 0) return; 
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex]);
}

// Search for a song
function searchSongs() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const matchingSongs = songs.filter(song => song.title.toLowerCase().includes(query));

    if (matchingSongs.length > 0) {
        playSong(matchingSongs[0]); 
    } else {
        alert("I couldn't find that song :(");
    }
}

// Play a specified song
function playSong(song) {
    if (!song || !song.url) {
        console.error("Invalid song or URL");
        return;
    }

    const audioSource = document.getElementById("audioSource");
    audioSource.src = song.url;

    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.load();
    audioPlayer.play().catch(error => {
        console.error("Error playing song:", error);
    });
}

// Play a test song
function playTestSong() {
    const audioSource = document.getElementById("audioSource");
    audioSource.src = 'https://raw.githubusercontent.com/ChrisIsEditing/chribswebsite/main/Music/japan.mp3'; 
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.load();
    audioPlayer.play().catch(error => {
        console.error("Error playing test song:", error);
    });
}

// Show keyboard shortcuts
function showShortcuts() {
    const shortcuts = `
    Keyboard Shortcuts:
    - R: Play a Random song
    - T: Play a Test song
    - H: Show this Help dialog
    - Ctrl + I + C + K: Redirect to YouTube video
    `;
    alert(shortcuts);
}

// Redirect to YouTube video
function redirectToYouTube() {
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Change to your desired YouTube URL
}

// Create and configure AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const audioPlayer = document.getElementById('audioPlayer');
const source = audioContext.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioContext.destination);

// Volume meter configuration
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const canvas = document.getElementById('volumeMeter');
const ctx = canvas.getContext('2d');

// Draw volume meter
function drawMeter() {
    requestAnimationFrame(drawMeter);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        const colorStop = i / bufferLength;
        gradient.addColorStop(0, `hsl(${colorStop * 240}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${colorStop * 330}, 100%, 50%)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}

// Resume audio context and draw meter when audio starts playing
audioPlayer.onplay = function() {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed');
        });
    }
    drawMeter();
};

// Event listeners
document.getElementById("searchButton").addEventListener("click", searchSongs);

document.addEventListener('keydown', function(event) {
    keysPressed.add(event.key.toLowerCase());

    if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        playRandomSong();
    }

    if (event.key.toLowerCase() === 't') {
        event.preventDefault();
        playTestSong();
    }

    if (event.key.toLowerCase() === 'h') {
        event.preventDefault();
        showShortcuts();
    }

    
    if (keysPressed.has('control') && keysPressed.has('i') && keysPressed.has('c') && keysPressed.has('k')) {
        event.preventDefault();
        redirectToYouTube();
    }
});

document.addEventListener('keyup', function(event) {
    keysPressed.delete(event.key.toLowerCase());
});


document.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed');
        });
    }
});
