/**
 * MOVIE FINDER - Final Version with Sorting & Local Filter
 * API: OMDB API
 */

const API_KEY = "8e2e9782";
const BASE_URL = "https://www.omdbapi.com/";

const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortFilter = document.getElementById('sortFilter');

// Local storage for the 6 "Fast" movies
let fastMovies = [];
let currentDisplayMovies = [];

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
 * Initial Load - Fetch the 6 "fast" movies
 */
async function initApp() {
    showSkeletons();

    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=fast`);
        const data = await response.json();

        if (data.Response === "True") {
            // Store exactly the first 6 "fast" movies
            fastMovies = data.Search.slice(0, 6);
            currentDisplayMovies = [...fastMovies];
            displayMovies(currentDisplayMovies);
        } else {
            moviesGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">Failed to load initial movies.</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        moviesGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">Something went wrong.</p>`;
    }
}

/**
 * Filter - Searches within the local fastMovies array
 */
function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        currentDisplayMovies = [...fastMovies];
    } else {
        currentDisplayMovies = fastMovies.filter(movie => {
            const titleMatch = movie.Title.toLowerCase().includes(query);
            const yearMatch = movie.Year.includes(query);
            return titleMatch || yearMatch;
        });
    }

    // Apply current sort after filtering
    applySort();
}

/**
 * Sort - Sorts the currently displayed movies
 */
function applySort() {
    const sortValue = sortFilter.value;

    if (sortValue === "A_TO_Z") {
        currentDisplayMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortValue === "Z_TO_A") {
        currentDisplayMovies.sort((a, b) => b.Title.localeCompare(a.Title));
    } else if (sortValue === "NEWEST") {
        currentDisplayMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    } else if (sortValue === "OLDEST") {
        currentDisplayMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    }

    displayMovies(currentDisplayMovies);
}

/**
 * Render Movies to Grid
 */
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    
    if (movies.length === 0) {
        moviesGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No matching movies found within the collection.</p>`;
        return;
    }

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
 * Event Listeners
 */
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('input', handleSearch);
sortFilter.addEventListener('change', applySort);

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

/**
 * Start
 */
window.addEventListener('DOMContentLoaded', initApp);