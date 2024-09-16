const keysPressed = new Set(); // 

let songs = [];
const queue = [];
let currentSongIndex = -1; 


function loadSongs() {
    fetch('music_list.json')
        .then(response => response.json())
        .then(data => {
            songs = data.map(item => ({
                title: item.name.replace('.mp3', ''),
                download_url: item.download_url 
            }));
            console.log(songs);
        })
        .catch(error => console.error('Error loading songs:', error));
}

document.addEventListener('DOMContentLoaded', loadSongs);


function playNextInQueue() {
    if (queue.length === 0) return;
    const nextSong = queue.shift(); 
    playSong(nextSong.song, nextSong.index); 
}


function addToQueue(song, index) {
    queue.push({ song, index });
    updateQueueDisplay();
}


function updateQueueDisplay() {
    const queueList = document.getElementById("queueList");
    queueList.innerHTML = '';

    queue.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item.song.title;

        listItem.classList.remove('current-song', 'queue-song');

        if (item.index === currentSongIndex) {
            listItem.textContent = `> ${item.song.title}`; 
            listItem.classList.add('current-song');  
        } else {
            listItem.classList.add('queue-song'); 
        }

        queueList.appendChild(listItem);
    });
}


function searchSongs() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const matchingSongs = songs.filter(song => song.title.toLowerCase().includes(query));

    if (matchingSongs.length > 0) {
        playSong(matchingSongs[0], songs.indexOf(matchingSongs[0])); 
        addToQueue(matchingSongs[0], songs.indexOf(matchingSongs[0])); 
    } else {
        alert("I couldn't find that song :(");
    }
}


function playRandomSong() {
    if (songs.length === 0) return; 
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex], -1);
}


function playTestSong() {
    const audioSource = document.getElementById("audioSource");
    audioSource.src = 'https://raw.githubusercontent.com/ChrisIsEditing/chribswebsite/main/Music/japan.mp3'; 
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.load();
    audioPlayer.play().catch(error => {
        console.error("Error playing test song:", error);
    });
}


function redirectToYouTube() {
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; 
}


const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const audioPlayer = document.getElementById('audioPlayer');
const source = audioContext.createMediaElementSource(audioPlayer);
source.connect(analyser);
analyser.connect(audioContext.destination);


analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const canvas = document.getElementById('volumeMeter');
const ctx = canvas.getContext('2d');


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
        const colorStop = (i / bufferLength) * 0.6; // 
        gradient.addColorStop(0, `hsl(${colorStop * 240}, 70%, 60%)`); // Blue
        gradient.addColorStop(1, `hsl(${colorStop * 340}, 70%, 80%)`); // Pink

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}



let drawInterval = 60; 
let lastDrawTime = 0;

function drawMeter() {
    requestAnimationFrame(drawMeter);
    const now = performance.now();
    
    if (now - lastDrawTime > drawInterval) {
        lastDrawTime = now;
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            const colorStop = (i / bufferLength) * 0.6; // Adjusted to slow down color transition
            gradient.addColorStop(0, `hsl(${colorStop * 240}, 70%, 60%)`); // Blue
            gradient.addColorStop(1, `hsl(${colorStop * 340}, 70%, 80%)`); // Pink

            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
}


function playSong(song, index) {
    if (!song || !song.download_url) { 
        console.error("Invalid song or URL");
        return;
    }

    const audioSource = document.getElementById("audioSource");
    audioSource.src = song.download_url; 
    const audioPlayer = document.getElementById("audioPlayer");

    audioPlayer.load();
    audioPlayer.play().catch(error => {
        console.error("Error playing song:", error);
    });

    currentSongIndex = index; 
    updateQueueDisplay(); 
}


audioPlayer.onplay = function() {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed');
        });
    }
    drawMeter();
};


document.getElementById("searchButton").addEventListener("click", searchSongs);
document.addEventListener('keydown', function(event) {
    keysPressed.add(event.key.toLowerCase());

    if (keysPressed.has('alt') && keysPressed.has('r')) {
        event.preventDefault();
        playRandomSong();
    }

    if (keysPressed.has('alt') && keysPressed.has('t')) {
        event.preventDefault();
        playTestSong();
    }

    if (keysPressed.has('r') && keysPressed.has('i') && keysPressed.has('c') && keysPressed.has('k')) {
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


audioPlayer.addEventListener('ended', playNextInQueue);
