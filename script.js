const nexstreamKey = 'nx_6bf33af689075b12885fc9faa5532341';
const searchApiKey = '3fd2be6f0c70a2a598f084ddfb75487c';

// 1. Instantly load a randomized feed on startup
document.addEventListener('DOMContentLoaded', () => {
    loadRandomFeed();
});

async function loadRandomFeed() {
    const randomPage = Math.floor(Math.random() * 10) + 1; 
    try {
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${searchApiKey}&sort_by=popularity.desc&page=${randomPage}`);
        const data = await res.json();
        document.getElementById('grid-title').innerText = "Trending Now";
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching feed", error);
    }
}

// 2. Smart Navbar Scroll Behavior
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
});

// 3. Filters and Search
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

// 4. Display Movies
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

// Open YOUR Dedicated Player Page in a New Tab
function playMovie(tmdbId) {
    window.open(`watch.html?id=${tmdbId}`, '_blank');
}