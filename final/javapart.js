
// DATABASE & UI INJECTION
const songs = [
  { title: "Chanel", artist: "Blaqbonez ft Asake", image: "images/chanel.png", audio: "audio/chanel.mp3", duration: "3:09" },
  { title: "Gratitude", artist: "Asake", image: "images/asake.png", audio: "audio/gratitude.mp3", duration: "3:45" },
  { title: "Forgiveness", artist: "Asake", image: "images/asake.png", audio: "audio/forgiveness.mp3", duration: "4:01" },
  { title: "Back Outside", artist: "BNXN, Sarz", image: "images/bnxn.png", audio: "audio/backoutside.mp3", duration: "3:28" },
  { title: "MCBH", artist: "Asake", image: "images/asake.png", audio: "audio/mcbh.mp3", duration: "3:55" },
  { title: "WORSHIP", artist: "Asake, DJ Snake", image: "images/asake.png", audio: "audio/worship.mp3", duration: "3:20" },
  { title: "City Boys", artist: "Burna Boy", image: "images/burnaboy.png", audio: "audio/cityboys.mp3", duration: "2:33" },
  { title: "Me & U", artist: "Tems", image: "images/tems.png", audio: "audio/meandu.mp3", duration: "3:10" }
];

const songList = document.getElementById("song-list");

// Inject songs into the playlist UI if it exists on the page
if (songList) {
    for(let i = 0; i < songs.length; i++) {
        const song = songs[i];
        songList.innerHTML += `
            <div class="song-row">
                <div class="song-left">
                    <span>${i + 1}</span>
                    <img src="${song.image}" class="row-cover">
                    <div>
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                </div>
                <div class="song-right">
                    <span>${song.duration}</span>
                </div>
            </div>
        `;
    }
}



// PLAYER CONTROLS & TRACK LOADING

const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const playIcon = playBtn.querySelector('i');

let currentSongIndex = 0;

// Function to load song details into the player
function loadTrack(index) {
    const song = songs[index];
    audioPlayer.src = song.audio;
    
    const albumArt = document.getElementById("album-art");
    const songTitle = document.getElementById("song-title");
    const artistName = document.getElementById("artist-name");
    
    if (albumArt) albumArt.src = song.image;
    if (songTitle) songTitle.innerText = song.title;
    if (artistName) artistName.innerText = song.artist;
}

// Load the very first song when the page opens
loadTrack(currentSongIndex);

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        audioPlayer.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
}

playBtn.addEventListener('click', togglePlay);

// Previous track
prevBtn.addEventListener('click', () => {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1; // Loop back to the very end
    }
    loadTrack(currentSongIndex);
    audioPlayer.play();
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
});

// Next track
nextBtn.addEventListener('click', () => {
    currentSongIndex++;
    if (currentSongIndex > songs.length - 1) {
        currentSongIndex = 0; // Loop back to the start
    }
    loadTrack(currentSongIndex);
    audioPlayer.play();
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
});

// Auto-play next song when current song finishes
audioPlayer.addEventListener('ended', () => {
    nextBtn.click();
});


//  PROGRESS BAR, VOLUME, AND LIKES

const progressBar = document.getElementById('progress-bar');
const volumeSlider = document.getElementById('volume-slider');
const likeBtn = document.getElementById('like-btn'); 

// Helper function to format raw seconds into M:SS
function formatTime(secs) {
    let mins = Math.floor(secs / 60);
    let seconds = Math.floor(secs % 60);
    if (seconds < 10) seconds = `0${seconds}`;
    return `${mins}:${seconds}`;
}

// 1. Update progress bar & ticking time
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        // Calculate current percentage
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percentage;
        
        // Dynamically update the visual green fill in the CSS
        progressBar.style.background = `linear-gradient(to right, var(--accent) ${percentage}%, var(--card-bg) ${percentage}%)`;
        
        // Update the ticking time text on the left
        const timeText = document.querySelector('.progress-wrapper .time:first-child');
        if (timeText) {
            timeText.innerText = formatTime(audioPlayer.currentTime);
        }
    }
});

// 2. Seek when progress bar is dragged
progressBar.addEventListener('input', () => {
    if (audioPlayer.duration) {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
        
        // Update the visual green fill immediately while dragging
        progressBar.style.background = `linear-gradient(to right, var(--accent) ${progressBar.value}%, var(--card-bg) ${progressBar.value}%)`;
    }
});

// 3. Volume control with visual fill updates
if (volumeSlider) {
    // Set the initial audio player volume and visual background on load
    const initialVolume = volumeSlider.value;
    audioPlayer.volume = initialVolume / 100;
    volumeSlider.style.background = `linear-gradient(to right, var(--accent) ${initialVolume}%, var(--card-bg) ${initialVolume}%)`;

    // Update volume and background when the slider moves
    volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        audioPlayer.volume = val / 100;
        volumeSlider.style.background = `linear-gradient(to right, var(--accent) ${val}%, var(--card-bg) ${val}%)`;
    });
}

// 4. Bulletproof Like button logic
if (likeBtn) {
    likeBtn.addEventListener('click', () => {
        likeBtn.classList.toggle('liked');
        const isLiked = likeBtn.classList.contains('liked');
        const heartIcon = likeBtn.querySelector('i');
        
        // Explicitly swap the FontAwesome class string to prevent conflicts
        if (isLiked) {
            heartIcon.className = 'fa-solid fa-heart';
            heartIcon.style.color = 'var(--accent)';
        } else {
            heartIcon.className = 'fa-regular fa-heart';
            heartIcon.style.color = ''; // Reverts to default CSS color
        }
    });
}