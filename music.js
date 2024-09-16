
let songs = [];
const repoOwner = 'chrisisediting'; 
const repoName = 'chribswebsite';
const directoryPath = 'Music'; 
const token = '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'; 


const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directoryPath}`;


function loadSongs() {
    fetch(apiUrl, {
        headers: {
            'Authorization': `token ${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}`
        }
    })
    .then(response => response.json())
    .then(data => {
        songs = data
            .filter(item => item.name.endsWith('.mp3'))
            .map(item => ({
                title: item.name.replace('.mp3', ''),
                url: `https://raw.githubusercontent.com/chrisisediting/chribswebsite/main/Music/${item.name}`
            }));
        console.log(songs); // songs array check
    })
    .catch(error => console.error('Error loading songs:', error));
}

document.addEventListener('DOMContentLoaded', loadSongs);

// Randomizer
function playRandomSong() {
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex]);
}

// Search 
function searchSongs() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const matchingSongs = songs.filter(song => song.title.toLowerCase().includes(query));

    if (matchingSongs.length > 0) {
        playSong(matchingSongs[0]); // Play first matching song
    } else {
        alert("I couldn't find that song :(");
    }
}

// Play specified song
function playSong(song) {
    const audioSource = document.getElementById("audioSource");
    audioSource.src = song.url;

    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.load();
    audioPlayer.play();
}

// event listeners
document.getElementById("searchButton").addEventListener("click", searchSongs);

// Volume Meter
const canvas = document.getElementById('volumeMeter');
const ctx = canvas.getContext('2d');
const audioPlayer = document.getElementById('audioPlayer');

// audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioContext.destination);

//analyser
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

//drawmeter
function drawMeter() {
    requestAnimationFrame(drawMeter);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        // gradient 
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        const colorStop = i / bufferLength; // Gradient color stop 
        gradient.addColorStop(0, `hsl(${colorStop * 240}, 100%, 50%)`); // Blue to Pink
        gradient.addColorStop(1, `hsl(${colorStop * 330}, 100%, 50%)`); // Pink

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}

// VM Draw
audioPlayer.onplay = function() {
    audioContext.resume();
    drawMeter();
};

// Random song (Ctrl + R)
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault(); // prevent default action
        playRandomSong();
    }
});
