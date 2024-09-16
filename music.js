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

// searcher
function searchSongs() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const matchingSongs = songs.filter(song => song.title.toLowerCase().includes(query));
    
    if (matchingSongs.length > 0) {
        playSong(matchingSongs[0]); // Play the first matching song
    } else {
        alert("I couldn't find that song :(");
    }
}

// playasonger
function playSong(song) {
    const audioSource = document.getElementById("audioSource");
    audioSource.src = song.url;

    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.load();
    audioPlayer.play();
}

// no clue dont ask
document.getElementById("searchButton").addEventListener("click", searchSongs);

// Volume meter
const canvas = document.getElementById('volumeMeter');
const ctx = canvas.getContext('2d');
const audioPlayer = document.getElementById('audioPlayer');

// aduio contect shit
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioContext.destination);

// ANALYSER
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

//draw meter!
function drawMeter() {
    requestAnimationFrame(drawMeter);
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        // gradient for each bar
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        const colorStop = i / bufferLength; // color stop position
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

// random song (Ctrl + R)
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'r') {
        event.preventDefault(); // prevent default action
        playRandomSong();
    }
});

