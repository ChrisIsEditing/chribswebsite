document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById("searchButton");
    const submitButton = document.getElementById("submitButton");
    const nextButton = document.getElementById("nextButton");
    const downloadButton = document.getElementById("downloadButton");

    if (!searchButton || !submitButton || !nextButton || !downloadButton) {
        console.error("One or more buttons are missing from the HTML.");
        return;
    }

    searchButton.addEventListener("click", searchSongs);
    submitButton.addEventListener("click", submitSong);
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

function submitSong() {
    window.open('https://forms.gle/ufuFncQVN1HaQH1a6', '_blank');
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
    const downloadUrl = song.download_url;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = song.title + ".mp3";
    a.click();
}

function searchSongs() {
    const query = document.getElementById("searchInput").value.toLowerCase();

    if (query === "/random") {
        
        const filteredSongs = songs.filter((song, index) => index !== currentSongIndex);
        const shuffledSongs = filteredSongs.sort(() => 0.5 - Math.random()).slice(0, 30);

       
        queue.length = 0;

        shuffledSongs.forEach(song => addToQueue(song, songs.indexOf(song)));

        if (shuffledSongs.length > 0) {
            
            if (currentSongIndex === -1) {
                playSong(shuffledSongs[0], songs.indexOf(shuffledSongs[0]));
            }
        }
        return;
    }
    if (query === "/clear") {
        
        queue.length = 0;
        console.log("Queue cleared.");
        updateQueueDisplay();
        return;
    }

    if (query === "/chribs") {
        const ChribsSongs = [
            "onions", 
            "elephant", 
            "", 
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ];


        const matchingChribsSongs = songs
            .filter(song => ChribsSongs.includes(song.title.toLowerCase()) &&
                            songs.indexOf(song) !== currentSongIndex);

        queue.length = 0;

        matchingChribsSongs.forEach(song => addToQueue(song, songs.indexOf(song)));

        if (matchingChribsSongs.length > 0) {
           
            if (currentSongIndex === -1) {
                playSong(matchingChribsSongs[0], songs.indexOf(matchingChribsSongs[0]));
            }
        }
        return;
    }


    if (query === "/fnaf") {
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
            "this comes from inside",
        ];


        const matchingFnafSongs = songs
            .filter(song => fnafSongs.includes(song.title.toLowerCase()) &&
                            songs.indexOf(song) !== currentSongIndex);

        queue.length = 0;

        matchingFnafSongs.forEach(song => addToQueue(song, songs.indexOf(song)));

        if (matchingFnafSongs.length > 0) {
           
            if (currentSongIndex === -1) {
                playSong(matchingFnafSongs[0], songs.indexOf(matchingFnafSongs[0]));
            }
        }
        return;
    }

    function showLoadingGif() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.display = 'flex';
    
        
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
        }, 4000);
      }
    
      if (query === "/all") {
        showLoadingGif();
    
        const filteredSongs = songs.filter((song, index) => index !== currentSongIndex);
    
        queue.length = 0;
    
        filteredSongs.forEach(song => addToQueue(song, songs.indexOf(song)));
    
        if (filteredSongs.length > 0) {
          if (currentSongIndex === -1) {
            playSong(filteredSongs[0], songs.indexOf(filteredSongs[0]));
          }
        }
        return;
      }
    
    if (query === "/all") {
        const filteredSongs = songs.filter((song, index) => index !== currentSongIndex);

        queue.length = 0;

        filteredSongs.forEach(song => addToQueue(song, songs.indexOf(song)));

        if (filteredSongs.length > 0) {
            if (currentSongIndex === -1) {
                playSong(filteredSongs[0], songs.indexOf(filteredSongs[0]));
            }
        }
        return;
    }
    
    const matchingSongs = songs.filter(song => song.title.toLowerCase().includes(query));

    if (matchingSongs.length > 0) {
        const songIndex = songs.findIndex(song => song.title === matchingSongs[0].title);
        const foundSong = matchingSongs[0];
    
        if (currentSongIndex !== -1 && songIndex !== currentSongIndex) {
            addToQueue(foundSong, songIndex);
            console.log(`Added "${foundSong.title}" to the queue`);
        } else {
            playSong(foundSong, songIndex);
        }
    } else {
        const matchingSongs = songs.filter(song => song.title.toLowerCase().includes(query));

        if (matchingSongs.length > 0) {
            const songIndex = songs.findIndex(song => song.title === matchingSongs[0].title);
            const foundSong = matchingSongs[0];
        
            if (currentSongIndex !== -1 && songIndex !== currentSongIndex) {
                addToQueue(foundSong, songIndex);
                console.log(`Added "${foundSong.title}" to the queue`);
            } else {
                playSong(foundSong, songIndex);
            }
        } else {
            console.log("No matching songs found."); 
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
}           
document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        document.getElementById("searchButton").click();
    }
});


//I have no clue what i'm doing


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
