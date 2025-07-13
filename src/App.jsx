
import { useState, useEffect } from "react";
import './App.css'
import SearchIcon from "./search.svg"
import MovieCard from "./moviecard";
import { Routes, Route, Link } from "react-router-dom";
import About from "./About";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "d60ecb78";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

function App() {
  const [movies, setMovies] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    year: "",
    rating: "",
    genre: ""
  });
  const [filteredMovies, setFilteredMovies] = useState([]);

  const searchMovies = async (title) => {
    setLoading(true);
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search);
    setFilteredMovies(data.Search); // Initialize filtered movies with all movies
    setLoading(false);
   
    // Add to recent searches if not already present
    if (title && !recentSearches.includes(title)) {
      setRecentSearches(prev => [title, ...prev.slice(0, 4)]); // Keep only 5 recent searches
    }
  };

  // Filter movies based on current filters
  const applyFilters = (moviesToFilter = movies) => {
    let filtered = moviesToFilter;

    if (filters.year) {
      filtered = filtered.filter(movie => movie.Year === filters.year);
    }

    if (filters.rating) {
      // Note: OMDB API doesn't provide rating in search results
      // This would need additional API calls to get detailed movie info
      // For now, we'll implement a basic filter structure
      filtered = filtered.filter(movie => {
        // This is a placeholder - in a real implementation, you'd need to fetch detailed movie data
        return true; // For now, don't filter by rating
      });
    }

    if (filters.genre) {
      // Note: OMDB API doesn't provide genre in search results
      // This would need additional API calls to get detailed movie info
      // For now, we'll implement a basic filter structure
      filtered = filtered.filter(movie => {
        // This is a placeholder - in a real implementation, you'd need to fetch detailed movie data
        return true; // For now, don't filter by genre
      });
    }

    setFilteredMovies(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(movies);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ year: "", rating: "", genre: "" });
    setFilteredMovies(movies);
  };



  const addToFavorites = (movie) => {
    if (!favorites.find(fav => fav.imdbID === movie.imdbID)) {
      setFavorites(prev => [...prev, movie]);
    }
  };

  const removeFromFavorites = (movieId) => {
    setFavorites(prev => prev.filter(fav => fav.imdbID !== movieId));
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMovies(searchTerm);
    } else if (e.key === 'Escape') {
      setSearchTerm("");
      setMovies([]);
    }
  };

  const handleSearchClick = () => {
    searchMovies(searchTerm);
  };

  const handleClearClick = () => {
    setSearchTerm("");
    setMovies([]);
  };

  
  useEffect(() => {
    searchMovies("Batman");
  }, []);

  // Apply filters when movies change
  useEffect(() => {
    applyFilters(movies);
  }, [movies, filters]);


  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <h1>MovieSearch</h1>
            <div className="search">
              <input placeholder="Search your movies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-label="Search for movies"
                role="searchbox"
                tabIndex="0"
              />
              <img 
                src={SearchIcon} 
                alt="search" 
                onClick={handleSearchClick}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
                tabIndex="0"
                role="button"
                aria-label="Search movies"
              />
              <button 
                className="clear-btn" 
                onClick={handleClearClick}
                onKeyPress={(e) => e.key === 'Enter' && handleClearClick()}
                aria-label="Clear search"
              >
                Clear
              </button>
            </div>
            
            {/* Filters Section */}
            <div className="filters-section">
              <div className="filters-container">
                <div className="filter-group">
                  <label htmlFor="year-filter">Year:</label>
                  <select 
                    id="year-filter"
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    aria-label="Filter by year"
                  >
                    <option value="">All Years</option>
                    {[...new Set(movies.map(movie => movie.Year))].sort().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label htmlFor="rating-filter">Rating:</label>
                  <select 
                    id="rating-filter"
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    aria-label="Filter by rating"
                  >
                    <option value="">All Ratings</option>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label htmlFor="genre-filter">Genre:</label>
                  <select 
                    id="genre-filter"
                    value={filters.genre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    aria-label="Filter by genre"
                  >
                    <option value="">All Genres</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Animation">Animation</option>
                    <option value="Biography">Biography</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Crime">Crime</option>
                    <option value="Drama">Drama</option>
                    <option value="Family">Family</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Horror">Horror</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                    <option value="War">War</option>
                  </select>
                </div>
                
                <button 
                  className="clear-filters-btn"
                  onClick={clearFilters}
                  aria-label="Clear all filters"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {recentSearches.length > 0 && (
              <div className="recent-searches">
                <h3>Recent Searches:</h3>
                <div className="search-tags">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      className="search-tag"
                      onClick={() => {
                        setSearchTerm(search);
                        searchMovies(search);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSearchTerm(search);
                          searchMovies(search);
                        }
                      }}
                      aria-label={`Search for ${search}`}
                      tabIndex="0"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="favorites-section">
              <button 
                className="favorites-btn"
                onClick={toggleFavorites}
                aria-label="Toggle favorites"
              >
                {showFavorites ? 'Hide Favorites' : 'Show Favorites'} ({favorites.length})
              </button>
            </div>
            {showFavorites && favorites.length > 0 && (
              <div className="favorites-container">
                <h3>Your Favorites:</h3>
                <div className="container">
                  {favorites.map((movie) => (
                    <div key={movie.imdbID} className="movie-with-favorite">
                      <MovieCard movie={movie} />
                      <button 
                        className="remove-favorite-btn"
                        onClick={() => removeFromFavorites(movie.imdbID)}
                        aria-label={`Remove ${movie.Title} from favorites`}
                      >
                        ❌ Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {loading && <div className="loader">Loading...</div>}
            {filteredMovies?.length > 0 ? (
              <div className="container">
                {filteredMovies.map((movie) => (
                  <div key={movie.imdbID} className="movie-with-favorite">
                    <MovieCard movie={movie} />
                    <button 
                      className="add-favorite-btn"
                      onClick={() => addToFavorites(movie)}
                      aria-label={`Add ${movie.Title} to favorites`}
                      disabled={favorites.find(fav => fav.imdbID === movie.imdbID)}
                    >
                      {favorites.find(fav => fav.imdbID === movie.imdbID) ? '❤️ Added' : '🤍 Add to Favorites'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                <h2>No movies found matching your filters</h2>
              </div>
            )}
          </div>
        } />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  )
}
export default App
