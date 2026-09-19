const nexstreamKey = 'nx_6bf33af689075b12885fc9faa5532341';
const searchApiKey = '3fd2be6f0c70a2a598f084ddfb75487c';

// Triggers a random page of popular movies on load
document.addEventListener('DOMContentLoaded', () => {
    loadRandomFeed();
});

// Randomize the feed
async function loadRandomFeed() {
    const randomPage = Math.floor(Math.random() * 15) + 1; // Pulls a random page from TMDB
    try {
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${searchApiKey}&sort_by=popularity.desc&page=${randomPage}`);
        const data = await res.json();
        document.getElementById('grid-title').innerText = "Recommended For You";
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching feed", error);
    }
}

// Toggle Filter Menu
function toggleFilters() {
    document.getElementById('filter-menu').classList.toggle('hidden');
}

// Apply Advanced Filters
async function applyFilters() {
    const genre = document.getElementById('genreFilter').value;
    const language = document.getElementById('languageFilter').value;
    const year = document.getElementById('yearFilter').value;

    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${searchApiKey}&sort_by=popularity.desc`;
    
    if (genre) url += `&with_genres=${genre}`;
    if (language) url += `&with_original_language=${language}`;
    if (year) url += `&primary_release_year=${year}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById('grid-title').innerText = "Filtered Results";
        displayMovies(data.results);
        toggleFilters(); // Close menu after searching
    } catch (error) {
        console.error("Filter error", error);
    }
}

// Standard Search
async function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${searchApiKey}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        document.getElementById('grid-title').innerText = `Search: "${query}"`;
        displayMovies(data.results);
    } catch (error) {
        console.error("Search error", error);
    }
}

// Render 3D Cards
function displayMovies(movies) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = ''; 

    if(movies.length === 0) {
        grid.innerHTML = '<p style="color:var(--cyan-accent);">No movies found matching criteria.</p>';
        return;
    }

    movies.forEach((movie, index) => {
        if (!movie.poster_path) return;

        const card = document.createElement('div');
        card.className = 'movie-card';
        // Slight stagger animation delay for each card
        card.style.animationDelay = `${index * 0.05}s`;
        card.onclick = () => playMovie(movie.id);

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
        img.loading = "lazy";

        card.appendChild(img);
        grid.appendChild(card);
    });
}

// 3D Player Launch
function playMovie(tmdbId) {
    const playerContainer = document.getElementById('player-container');
    const videoWrapper = document.getElementById('video-wrapper');
    
    const streamUrl = `https://api.codespecters.com/embed/movie/${tmdbId}?apikey=${nexstreamKey}`;
    videoWrapper.innerHTML = `<iframe src="${streamUrl}" allowfullscreen></iframe>`;
    
    playerContainer.classList.remove('hidden');
}

// Close Player
function closePlayer() {
    const playerContainer = document.getElementById('player-container');
    const videoWrapper = document.getElementById('video-wrapper');
    
    videoWrapper.innerHTML = ''; 
    playerContainer.classList.add('hidden');
}