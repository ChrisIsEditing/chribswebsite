const songs = [
    { title: "Song 1", url: "/Music/song1.mp3" },
    { title: "Song 2", url: "/Music/song2.mp3" },
    { title: "Song 3", url: "/Music/song3.mp3" },
];

// Randomizer
function playRandomSong() {
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex]);
}

// Search Function
function searchSongs() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const matchingSongs = songs.filter(song => song.title.toLowerCase().includes(query));
    
    if (matchingSongs.length > 0) {
        playSong(matchingSongs[0]); // Play the first matching song
    } else {
        alert("I couldn't find that song :(");
    }
}

// Play a specific song
function playSong(song) {
    const audioSource = document.getElementById("audioSource");
    audioSource.src = song.url;

    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.load();
    audioPlayer.play();
}

// Event listeners
document.getElementById("searchButton").addEventListener("click", searchSongs);

// Volume Meter Visualization
const canvas = document.getElementById('volumeMeter');
const ctx = canvas.getContext('2d');
const audioPlayer = document.getElementById('audioPlayer');

// Audio Context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioContext.destination);

// Configure Analyser
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawMeter() {
    requestAnimationFrame(drawMeter);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        ctx.fillStyle = 'rgb(0, 220, 0)';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}

// VM Draw
audioPlayer.onplay = function() {
    audioContext.resume();
    drawMeter();
};


