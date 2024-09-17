const keysPressed = new Set(); 

let songs = [];
const queue = [];
let currentSongIndex = -1;
let shuffleMode = false;

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
    if (queue.length === 0) {
        console.log("Queue is empty.");
        return;
    }

    let nextSong;
    if (shuffleMode) {
        // Shuffle mode
        const randomIndex = Math.floor(Math.random() * queue.length);
        nextSong = queue.splice(randomIndex, 1)[0];
    } else {
        // Normal mode
        nextSong = queue.shift();
    }

    playSong(nextSong.song, nextSong.index);
}

function addToQueue(song, index) {
    queue.push({ song, index });
    updateQueueDisplay();
}

function updateQueueDisplay() {
    const queueList = document.getElementById("queueList");
    if (!queueList) {
        console.error("Queue list element not found");
        return;
    }

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
        const songIndex = songs.findIndex(song => song.title === matchingSongs[0].title);
        playSong(matchingSongs[0], songIndex);
        addToQueue(matchingSongs[0], songIndex);
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

function easteregg1() {
    const audioSource = document.getElementById("audioSource");
    audioSource.src = '/Music/Never Gonna Give You Up.mp3';
    const audioPlayer = document.getElementById("audioPlayer");

    audioPlayer.load();
    audioPlayer.play().catch(error => {
        console.error("Error playing Easter egg 1:", error);
    });
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

function drawAlbumCover(imageSrc) {
    const img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageSrc;
}

let drawInterval = 80; 
let lastDrawTime = 0;

function drawMeter() {
    requestAnimationFrame(drawMeter); 
    const now = performance.now();
    
    if (now - lastDrawTime > drawInterval) {
        lastDrawTime = now;
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (currentSongIndex !== -1 && songs[currentSongIndex] && songs[currentSongIndex].cover_url) {
            const albumCoverUrl = songs[currentSongIndex].cover_url;
            drawAlbumCover(albumCoverUrl);
        }

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, `rgb(31, 10, 255)`); // Start
            gradient.addColorStop(1, `rgb(255, 0, 115)`); // End

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
    if (!audioSource) {
        console.error("Audio source element not found");
        return;
    }
    
    audioSource.src = song.download_url; 
    
    const audioPlayer = document.getElementById("audioPlayer");
    if (!audioPlayer) {
        console.error("Audio player element not found");
        return;
    }

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
        easteregg1();
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

function shuffleQueue() {
    shuffleMode = !shuffleMode;
    if (shuffleMode) {
        queue.sort(() => Math.random() - 0.5); 
    }
    updateQueueDisplay(); 
}

function playPreviousSong() {
    if (currentSongIndex > 0) {
        playSong(songs[currentSongIndex - 1], currentSongIndex - 1);
    } else if (queue.length > 0) {
        playSong(queue[queue.length - 1].song, queue[queue.length - 1].index);
    } else {
        console.log("No previous song available.");
    }
}

document.getElementById('prevButton').addEventListener('click', playPreviousSong);
document.getElementById('nextButton').addEventListener('click', playNextInQueue);

audioPlayer.addEventListener('ended', playNextInQueue);
