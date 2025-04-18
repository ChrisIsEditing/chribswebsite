document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById("searchButton");
    const commandsButton = document.getElementById("commandsButton");
    const nextButton = document.getElementById("nextButton");
    const downloadButton = document.getElementById("downloadButton");

    if (!searchButton || !commandsButton || !nextButton || !downloadButton) {
        console.error("One or more buttons are missing from the HTML.");
        return;
    }

    searchButton.addEventListener("click", searchSongs);
    commandsButton.addEventListener("click", showCommandsPopup);
    nextButton.addEventListener("click", playNextInQueue);
    downloadButton.addEventListener("click", downloadCurrentSong);
});

document.addEventListener('DOMContentLoaded', function () {
    const nextButton = document.getElementById("nextButton");
    if (nextButton) {
        nextButton.addEventListener("click", playNextInQueue);
    }
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
            songsLoaded = true; //Songs Loaded 
        })
        .catch(error => console.error('Error loading songs:', error));
}

document.addEventListener('DOMContentLoaded', loadSongs);

function commandsButton() {
    function showPopup() {
        document.getElementById('commandsPopup').style.display = 'block';
    }

    function closePopup() {
        document.getElementById('commandsPopup').style.display = 'none';
    }
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

    if (queue.length === 0) {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "Queue is empty";
        emptyMessage.style.fontStyle = "italic";
        emptyMessage.style.color = "#888";
        queueList.appendChild(emptyMessage);
    } else {
        queue.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = item.song.title;

            listItem.classList.remove('current-song', 'queue-song');

            if (item.index === currentSongIndex) {
                listItem.textContent = `> ${item.song.title}`;
                listItem.classList.add('current-song');
            } else {
                listItem.classList.add('queue-song');
                
                listItem.addEventListener('click', () => {
                    playSelectedSong(index);
                });
            }

            queueList.appendChild(listItem);
        });
    }
}

function playSelectedSong(queueIndex) {
    if (queueIndex < 0 || queueIndex >= queue.length) {
        console.error("Invalid queue index");
        return;
    }

    const song = queue[queueIndex].song;
    const index = queue[queueIndex].index;

    
    playSong(song, index);

    
    queue.splice(queueIndex, 1);
    updateQueueDisplay();
}


function downloadCurrentSong() {

    if (currentSongIndex === -1) { 
        console.log("No song is currently playing.");
        return;
    }

    const song = songs[currentSongIndex];
    if (!song || !song.download_url) {
        console.error("Invalid song data");
        return;
    }

    try {

        const a = document.createElement("a");
        a.href = song.download_url;
        a.download = `${song.title}.mp3`;
        
        document.body.appendChild(a);
        
        // Trigger download
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
        }, 100);
    } catch (error) {
        console.error("Error downloading song:", error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById("downloadButton");
    if (downloadButton) {
        downloadButton.addEventListener("click", downloadCurrentSong);
    } else {
        console.error("Download button not found in the DOM");
    }
});


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); //Shuffle Math
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function searchSongs() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    
    function processCommand(songList = null, maxSongs = Infinity) {
        const filteredSongs = songs.filter((song, index) => index !== currentSongIndex);
        let selectedSongs;
        
        if (songList) {
            selectedSongs = filteredSongs.filter(song => songList.includes(song.title.toLowerCase()));
        } else {
            selectedSongs = shuffleArray([...filteredSongs]).slice(0, maxSongs);
        }

        if (currentSongIndex === -1 && selectedSongs.length > 0) {
            const firstSong = selectedSongs[0];
            playSong(firstSong, songs.indexOf(firstSong));
            selectedSongs.slice(1).forEach(song => addToQueue(song, songs.indexOf(song)));
        } else {
            selectedSongs.forEach(song => addToQueue(song, songs.indexOf(song)));
        }
    }

    switch (query) {
        case "/random":
            processCommand(null, 30);
            return;

        case "/party":
            processCommand(null, 90);
            return;

        case "/clear":
            queue.length = 0;
            updateQueueDisplay();
            return;

        case "/all":
            showLoadingGif();
            processCommand(null, Infinity);
            return;

        case "/fnaf":
            const fnafSongs = [
                "five nights at freddy's", 
                "you can't hide", 
                "join us for a bite", 
                "i got no time",
                "stay calm",
                "stuck inside",
                "it's me",
                "it's been so long",
                "they'll find you",
                "this comes from inside"
            ];
            processCommand(fnafSongs);
            return;

        case "/chribs":
            const chribsSongs = [
                "onions",
                "elephant",
                'cells'

            ];
            processCommand(chribsSongs);
            return;

            case "/chribs":
                const testSongs = [
                    "scarlet fire", 
                ];
                processCommand(testSongs);
                return;
    }

    const matchingSongs = songs.filter(song => song.title.toLowerCase().includes(query));

    if (matchingSongs.length > 0) {
        const songIndex = songs.findIndex(song => song.title === matchingSongs[0].title);
        const foundSong = matchingSongs[0];
    
        if (currentSongIndex === -1) {
            playSong(foundSong, songIndex);
        } else if (songIndex !== currentSongIndex) {
            addToQueue(foundSong, songIndex);
            console.log(`Added "${foundSong.title}" to the queue`);
        }
    } else {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "I couldn't find that song :(";
        errorMessage.style.display = "flex";
        errorMessage.classList.remove("slide-out");
        errorMessage.classList.add("slide-in");

        setTimeout(() => {
            errorMessage.classList.remove("slide-in");
            errorMessage.classList.add("slide-out");
        }, 3000);

        setTimeout(() => {
            errorMessage.style.display = "none";
            errorMessage.classList.remove("slide-out");
        }, 3500);
    }
}
document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        document.getElementById("searchButton").click();
    }
});

function playSong(song, index) {
    if (!song || !song.download_url) {
        console.error("Invalid song or URL");
        return;
    }
    const audioSource = document.getElementById("audioSource");
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
    const currentSongNameElement = document.getElementById("currentSongName");
    if (currentSongNameElement) {
        currentSongNameElement.textContent = song.title;
    }
    fetchAlbumArt(song.download_url); 
}

function fetchAlbumArt(url) {
    jsmediatags.read(url, {
        onSuccess: function (tag) {
            const { tags } = tag;
            if (tags && tags.picture) {
                const picture = tags.picture;
                const base64String = "data:" + picture.format + ";base64," + arrayBufferToBase64(picture.data);
                displayAlbumArt(base64String);
            }
        },
        onError: function (error) {
            console.error("Error reading ID3 tags:", error);
        }
    });
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function displayAlbumArt(base64String) {
    const img = new Image();
    img.onload = function () {
        const canvas = document.getElementById('volumeMeter');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = base64String;
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

let drawInterval = 80;
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
            gradient.addColorStop(0, `rgb(31, 10, 255)`); // Start
            gradient.addColorStop(1, `rgb(255, 0, 115)`); // End

            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
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

