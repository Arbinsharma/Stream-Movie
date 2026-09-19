const nexstreamKey = 'nx_6bf33af689075b12885fc9faa5532341';
const searchApiKey = '3fd2be6f0c70a2a598f084ddfb75487c';

// 1. Initialize Onboarding & Preferences
document.addEventListener('DOMContentLoaded', () => {
    const savedGenres = localStorage.getItem('userPreferences');
    if (!savedGenres) {
        document.getElementById('welcome-modal').classList.remove('hidden');
    } else {
        loadPersonalizedFeed(savedGenres);
    }
});

// Bug Fix: Toggle class directly instead of using an array
function toggleGenre(button) {
    button.classList.toggle('selected');
}

// Bug Fix: Check the DOM directly to see what is selected
function saveUserGenres() {
    const selectedButtons = document.querySelectorAll('.genre-tag.selected');
    
    if (selectedButtons.length === 0) {
        alert("Bro, please select at least one genre!");
        return;
    }

    // Map through selected buttons and grab their IDs
    const genreArray = Array.from(selectedButtons).map(btn => btn.getAttribute('data-id'));
    const genreString = genreArray.join(',');
    
    localStorage.setItem('userPreferences', genreString);
    document.getElementById('welcome-modal').classList.add('hidden');
    loadPersonalizedFeed(genreString);
}

// 2. Fetch Personalized Feed
async function loadPersonalizedFeed(genres) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${searchApiKey}&sort_by=popularity.desc&with_genres=${genres}`);
        const data = await res.json();
        document.getElementById('grid-title').innerText = "Recommended For You";
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching personalized feed", error);
    }
}

// (Keep the rest of your script.js exactly the same below this line: Smart Navbar, Search, Apply Filters, Display Movies, Play/Close Movie)

// 3. Smart Navbar Scroll Behavior
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    // Hide nav if scrolling down and past 100px. Show if scrolling up.
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
});

// 4. Standard Functions (Search, Filter, Display, Play)
function toggleFilters() {
    document.getElementById('filter-menu').classList.toggle('hidden');
}

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
        toggleFilters(); 
    } catch (error) {
        console.error("Filter error", error);
    }
}

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

function displayMovies(movies) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = ''; 

    movies.forEach(movie => {
        if (!movie.poster_path) return;

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => playMovie(movie.id);

        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        img.alt = movie.title;
        img.loading = "lazy";

        card.appendChild(img);
        grid.appendChild(card);
    });
}

function playMovie(tmdbId) {
    const playerContainer = document.getElementById('player-container');
    const videoWrapper = document.getElementById('video-wrapper');
    const streamUrl = `https://api.codespecters.com/embed/movie/${tmdbId}?apikey=${nexstreamKey}`;
    videoWrapper.innerHTML = `<iframe src="${streamUrl}" allowfullscreen></iframe>`;
    playerContainer.classList.remove('hidden');
}

function closePlayer() {
    const playerContainer = document.getElementById('player-container');
    const videoWrapper = document.getElementById('video-wrapper');
    videoWrapper.innerHTML = ''; 
    playerContainer.classList.add('hidden');
}