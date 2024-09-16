

let songs = [];
const queue = [];
let currentSongIndex = -1; 

//on a hilltop somewhere, there is a man,
//a man of great passion and filled with pure happiness.
//He is not I, for I am the direct opposite of such a concept.
//There is no joy to be found here, only pain and suffering as far as one can see.

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

function playSong(song, index) {
    if (!song || !song.url) {
        console.error("Invalid song or URL");
        return;
    }

    const audioPlayer = document.getElementById("audioPlayer");
    const audioSource = document.getElementById("audioSource");
    audioSource.src = song.url;

    audioPlayer.load();
    audioPlayer.play().catch(error => {
        console.error("Error playing song:", error);
    });

    currentSongIndex = index; // Update current song index
    updateQueueDisplay(); // Update queue display
}


// Play the next song in the queue
function playNextInQueue() {
    if (queue.length === 0) return;
    const nextSong = queue.shift(); 
    playSong(nextSong.song, nextSong.index); 
}

// Add a song to the queue
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
        playSong(matchingSongs[0], songs.indexOf(matchingSongs[0])); // Pass song and index
        addToQueue(matchingSongs[0], songs.indexOf(matchingSongs[0])); // Pass song and index
    } else {
        alert("I couldn't find that song :(");
    }
}


// Play random song
function playRandomSong() {
    if (songs.length === 0) return; 
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex], -1);
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

// Event listeners for keydown and keyup
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

// Play the next song in the queue when the current song ends
audioPlayer.addEventListener('ended', playNextInQueue);

const keysPressed = new Set(); // Initialize keysPressed

