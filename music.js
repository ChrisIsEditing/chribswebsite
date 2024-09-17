document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById("searchButton");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    const downloadButton = document.getElementById("downloadButton");

    if (!searchButton || !prevButton || !nextButton || !downloadButton) {
        console.error("One or more buttons are missing from the HTML.");
        return;
    }

    searchButton.addEventListener("click", searchSongs);
    prevButton.addEventListener("click", playPreviousSong);
    nextButton.addEventListener("click", playNextInQueue);
    downloadButton.addEventListener("click", downloadCurrentSong);
});

const keysPressed = new Set();
let songs = [];
const queue = [];
let currentSongIndex = -1;

function loadSongs() {
    fetch('music_list.json')
        .then(response => response.json())
        .then(data => {
            songs = data.map(item => ({
                title: item.name.replace('.mp3', ''),
                download_url: item.download_url,
                cover_url: item.cover_url
            }));
            console.log(songs);
        })
        .catch(error => console.error('Error loading songs:', error));
}

document.addEventListener('DOMContentLoaded', loadSongs);

function playPreviousSong() {
    if (queue.length === 0) {
        console.log("Queue is empty.");
        return;
    }

    let previousSong;
    const currentIndex = queue.findIndex(item => item.index === currentSongIndex);
    if (currentIndex === 0) {
        previousSong = queue[queue.length - 1];
    } else {
        previousSong = queue[currentIndex - 1];
    }

    playSong(previousSong.song, previousSong.index);
    updateQueueDisplay();
}

function nextTrack() {
    if (track_index < track_list.length - 1) {
        track_index++;
    } else {
        track_index = 0; 
    }
    const nextSong = track_list[track_index];
    playSong(nextSong, track_index);
}

function playNextInQueue() {
    if (queue.length === 0) {
        console.log("Queue is empty.");
        return;
    }

    const nextSong = queue.shift();
    if (nextSong) {
        playSong(nextSong.song, nextSong.index);
    }
    updateQueueDisplay();
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

function downloadCurrentSong() {
    if (currentSongIndex === -1) {
        console.log("No song is currently playing.");
        return;
    }

    const song = songs[currentSongIndex];
    const downloadUrl = song.download_url;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = song.title + ".mp3";
    a.click();
}

function searchSongs() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const matchingSongs = songs.filter(song => song.title.toLowerCase().includes(query));

    if (matchingSongs.length > 0) {
        const songIndex = songs.findIndex(song => song.title === matchingSongs[0].title);
        const foundSong = matchingSongs[0];

        if (currentSongIndex !== -1) {
            
            addToQueue(foundSong, songIndex);
            console.log(`Added "${foundSong.title}" to the queue`);
        } else {
            
            playSong(foundSong, songIndex);
            
        }
    } else {
        alert("I couldn't find that song :(");
    }
}

function playRandomSong() {
    if (songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex], randomIndex);
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

function autoPlayNextInQueue() {
    if (queue.length > 0) {
        const nextSong = queue.shift(); 
        playSong(nextSong.song, nextSong.index);
    } else {
        console.log("Queue is empty. Playback stopped.");
        currentSongIndex = -1; 
    }
    updateQueueDisplay();
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

   
    if (currentSongIndex === -1) {
        queue.length = 0;
    }

    currentSongIndex = index;
    updateQueueDisplay();
}

audioPlayer.addEventListener('ended', autoPlayNextInQueue);

audioPlayer.onplay = function() {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed');
        });
    }
    drawMeter();
};

audioPlayer.onpause = function() {
    
};

audioPlayer.onloadeddata = function() {
    console.log('Audio data loaded');
};