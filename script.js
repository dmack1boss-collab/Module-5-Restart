/**
 * MOVIE FINDER - Refined API Search Version
 * API: OMDB API
 */

const API_KEY = "8e2e9782";
const BASE_URL = "https://www.omdbapi.com/";

const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortFilter = document.getElementById('sortFilter');

// Store current search results for sorting
let currentMovies = [];

/**
 * Show Skeleton Loaders
 */
function showSkeletons() {
    moviesGrid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'movie-card skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="movie-info">
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
            </div>
        `;
        moviesGrid.appendChild(skeleton);
    }
}

/**
 * Fetch Movies from API based on search query
 */
async function fetchMovies(query) {
    if (!query) return;
    
    showSkeletons();

    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`);
        const data = await response.json();

        // Small delay to appreciate the skeleton state
        setTimeout(() => {
            if (data.Response === "True") {
                // Take first 6 results
                currentMovies = data.Search.slice(0, 6);
                applySort(); // This will also call displayMovies
            } else {
                currentMovies = [];
                showNoResults(data.Error || "No movies found matching your search.");
            }
        }, 600);

    } catch (error) {
        console.error("API Error:", error);
        currentMovies = [];
        showNoResults("Oops! Something went wrong while fetching movies. Please try again.");
    }
}

/**
 * Sort the current batch of movies
 */
function applySort() {
    const sortValue = sortFilter.value;

    if (sortValue === "A_TO_Z") {
        currentMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortValue === "Z_TO_A") {
        currentMovies.sort((a, b) => b.Title.localeCompare(a.Title));
    } else if (sortValue === "NEWEST") {
        currentMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    } else if (sortValue === "OLDEST") {
        currentMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    }

    displayMovies(currentMovies);
}

/**
 * Render Movies to Grid
 */
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    
    if (movies.length === 0) return; // Should be handled by showNoResults

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        const posterUrl = movie.Poster !== "N/A" 
            ? movie.Poster 
            : "https://via.placeholder.com/400x600?text=No+Image";

        card.innerHTML = `
            <div class="poster-wrapper">
                <img src="${posterUrl}" alt="${movie.Title}">
            </div>
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p><strong>Year:</strong> ${movie.Year}</p>
                <p><strong>Type:</strong> ${movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}</p>
            </div>
        `;
        
        moviesGrid.appendChild(card);
    });
}

/**
 * Show No Results or Error Message
 */
function showNoResults(message) {
    moviesGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <p style="font-size: 18px; color: #666; font-weight: 500;">${message}</p>
        </div>
    `;
}

/**
 * Event Listeners
 */
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) fetchMovies(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) fetchMovies(query);
    }
});

sortFilter.addEventListener('change', applySort);

/**
 * Initial Load - Default to "fast"
 */
window.addEventListener('DOMContentLoaded', () => {
    fetchMovies("fast");
});