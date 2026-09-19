// Your NexStream API Key for streaming video
const nexstreamKey = 'nx_6bf33af689075b12885fc9faa5532341';

// Public TMDB key for searching movie titles and loading posters
const searchApiKey = '3fd2be6f0c70a2a598f084ddfb75487c';

// Load trending movies when the page opens
document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();
});

// Fetch popular movies
async function fetchTrendingMovies() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${searchApiKey}`);
        const data = await res.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching movies", error);
    }
}

// Search for specific movies
async function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${searchApiKey}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        // Update section title to show search results
        document.querySelector('.section-title').innerText = `Search Results for "${query}"`;
        displayMovies(data.results);
    } catch (error) {
        console.error("Error searching movies", error);
    }
}

// Generate the movie grid on the screen
function displayMovies(movies) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = ''; 

    if(movies.length === 0) {
        grid.innerHTML = '<p style="color:#fff;">No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        if (!movie.poster_path) return; // Skip if movie has no poster image

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => playMovie(movie.id);

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
        img.loading = "lazy"; // Prevents lag by loading images as you scroll

        card.appendChild(img);
        grid.appendChild(card);
    });
}

// Open the player and launch the NexStream API
function playMovie(tmdbId) {
    const playerContainer = document.getElementById('player-container');
    const videoWrapper = document.getElementById('video-wrapper');
    
    // Pass the TMDB ID into your NexStream link
    const streamUrl = `https://api.codespecters.com/embed/movie/${tmdbId}?apikey=${nexstreamKey}`;
    
    videoWrapper.innerHTML = `<iframe src="${streamUrl}" allowfullscreen></iframe>`;
    
    playerContainer.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

// Stop the video and close the player
function closePlayer() {
    const playerContainer = document.getElementById('player-container');
    const videoWrapper = document.getElementById('video-wrapper');
    
    videoWrapper.innerHTML = ''; // Stops the video audio from playing in background
    playerContainer.classList.add('hidden');
}