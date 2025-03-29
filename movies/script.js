// script.js - Complete Refined Version
document.addEventListener('DOMContentLoaded', () => {
    // API Configuration
    const config = {
        omdbApiKey: "1e132333",
        youtubeApiKey: "AIzaSyA7P7JGKFIhoKXn0L4IjzmjUekgz9_5mUM",
        omdbBaseUrl: "https://www.omdbapi.com/",
        youtubeBaseUrl: "https://www.googleapis.com/youtube/v3/search",
        defaultMovies: ["Avengers", "Batman", "Inception", "Interstellar", "Joker"]
    };

    // DOM Elements
    const elements = {
        searchInput: document.getElementById('searchInput'),
        searchButton: document.getElementById('searchButton'),
        searchResults: document.getElementById('searchResults'),
        trendingNow: document.getElementById('trendingNow'),
        topPicks: document.getElementById('topPicks'),
        popupPlayer: document.getElementById('popupPlayer'),
        closePopup: document.getElementById('closePopup'),
        popupTitle: document.getElementById('popupTitle'),
        youtubeIframe: document.getElementById('youtubeIframe'),
        heroPlayBtn: document.querySelector('.hero .play-btn'),
        heroInfoBtn: document.querySelector('.hero .info-btn')
    };

    // State Management
    const state = {
        currentSearch: "",
        isLoading: false,
        carouselPositions: {
            trendingNow: 0,
            topPicks: 0
        }
    };

    // Initialize the app
    function init() {
        setupEventListeners();
        loadDefaultContent();
    }

    // Event Listeners
    function setupEventListeners() {
        // Search functionality
        elements.searchButton.addEventListener('click', handleSearch);
        elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });

        // Popup controls
        elements.closePopup.addEventListener('click', closeTrailerPopup);
        elements.popupPlayer.addEventListener('click', (e) => {
            if (e.target === elements.popupPlayer) closeTrailerPopup();
        });

        // Hero buttons
        elements.heroPlayBtn.addEventListener('click', () => {
            playRandomTrailer();
        });
        elements.heroInfoBtn.addEventListener('click', showFeaturedInfo);

        // Carousel navigation
        document.querySelectorAll('.scroll-btn').forEach(btn => {
            btn.addEventListener('click', handleCarouselScroll);
        });
    }

    // API Functions
    async function fetchMovies(keyword) {
        if (state.isLoading) return;
        state.isLoading = true;
        
        try {
            const url = `${config.omdbBaseUrl}?s=${encodeURIComponent(keyword)}&apikey=${config.omdbApiKey}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.Response === "True") {
                return data.Search;
            } else {
                showNotification(data.Error || "No movies found");
                return [];
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            showNotification("Failed to fetch movies. Please try again later.");
            return [];
        } finally {
            state.isLoading = false;
        }
    }

    async function fetchYouTubeTrailer(movieTitle) {
        showLoading(true);
        
        try {
            const url = `${config.youtubeBaseUrl}?part=snippet&q=${encodeURIComponent(movieTitle + " official trailer")}&key=${config.youtubeApiKey}&maxResults=1`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`YouTube API error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                return `https://www.youtube.com/embed/${data.items[0].id.videoId}?autoplay=1`;
            } else {
                showNotification("No trailer available for this movie");
                return null;
            }
        } catch (error) {
            console.error("Error fetching YouTube trailer:", error);
            showNotification("Failed to load trailer. Please try again later.");
            return null;
        } finally {
            showLoading(false);
        }
    }

    // UI Functions
    async function populateCarousel(keyword, carouselId) {
        const carouselRow = document.querySelector(`#${carouselId} .carousel-row`);
        if (!carouselRow) return;
        
        showLoading(true, carouselRow);
        
        const movies = await fetchMovies(keyword);
        carouselRow.innerHTML = "";
        
        if (movies.length === 0) {
            carouselRow.innerHTML = `<div class="no-results">No movies found for "${keyword}"</div>`;
            showLoading(false, carouselRow);
            return;
        }
        
        movies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            carouselRow.appendChild(movieCard);
        });
        
        showLoading(false, carouselRow);
        updateCarouselControls(carouselId);
    }

    function createMovieCard(movie) {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        const posterUrl = movie.Poster !== "N/A" 
            ? movie.Poster 
            : 'https://via.placeholder.com/200x300?text=No+Poster';
        
        card.innerHTML = `
            <img src="${posterUrl}" alt="${movie.Title} Poster" loading="lazy">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p class="year">${movie.Year}</p>
                <button class="play-button" data-movie="${movie.Title}">
                    <i class="fas fa-play"></i> Play Trailer
                </button>
            </div>
        `;
        
        card.querySelector('.play-button').addEventListener('click', () => {
            playTrailer(movie.Title);
        });
        
        return card;
    }

    async function playTrailer(movieTitle) {
        const youtubeUrl = await fetchYouTubeTrailer(movieTitle);
        if (!youtubeUrl) return;
        
        elements.popupTitle.textContent = `Now Playing: ${movieTitle}`;
        elements.youtubeIframe.src = youtubeUrl;
        elements.popupPlayer.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeTrailerPopup() {
        elements.youtubeIframe.src = '';
        elements.popupPlayer.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Carousel Functions
    function handleCarouselScroll(e) {
        const carouselId = e.currentTarget.closest('.carousel').id;
        const direction = e.currentTarget.classList.contains('left') ? -1 : 1;
        
        const carouselRow = document.querySelector(`#${carouselId} .carousel-row`);
        if (!carouselRow) return;
        
        const scrollAmount = 300;
        carouselRow.scrollBy({
            left: scrollAmount * direction,
            behavior: 'smooth'
        });
    }

    function updateCarouselControls(carouselId) {
        const carouselRow = document.querySelector(`#${carouselId} .carousel-row`);
        if (!carouselRow) return;
        
        const controls = carouselRow.closest('.carousel').querySelector('.controls');
        if (!controls) return;
        
        // You can implement more sophisticated control logic here
        // For example, disable buttons when at start/end of scroll
    }

    // Helper Functions
    function showLoading(show, element = document.body) {
        if (show) {
            const loader = document.createElement('div');
            loader.className = 'loading-spinner';
            loader.id = 'current-loader';
            element.appendChild(loader);
        } else {
            const loader = element.querySelector('#current-loader');
            if (loader) loader.remove();
        }
    }

    function showNotification(message, type = 'error') {
        // Remove any existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Content Loading
    function loadDefaultContent() {
        // Load trending movies
        populateCarousel(config.defaultMovies[0], 'trendingNow');
        
        // Load top picks
        populateCarousel(config.defaultMovies[1], 'topPicks');
        
        // You could load more sections here
    }

    async function playRandomTrailer() {
        const randomIndex = Math.floor(Math.random() * config.defaultMovies.length);
        const randomMovie = config.defaultMovies[randomIndex];
        await playTrailer(randomMovie);
    }

    function showFeaturedInfo() {
        // This could show more information about the featured movie
        showNotification("Featured movie information would appear here", 'info');
    }

    // Search Handling
    async function handleSearch() {
        const query = elements.searchInput.value.trim();
        
        if (!query) {
            showNotification("Please enter a movie title");
            elements.searchInput.focus();
            return;
        }
        
        state.currentSearch = query;
        elements.searchResults.classList.remove('hidden');
        await populateCarousel(query, 'searchResults');
    }

    // Initialize the app
    init();
});