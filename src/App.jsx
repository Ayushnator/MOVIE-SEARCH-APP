
import { useState, useEffect } from "react";
import './App.css'
import SearchIcon from "./search.svg"
import MovieCard from "./moviecard";
import { Routes, Route, Link } from "react-router-dom";
// Removed: import About from "./About";

function About() {
  return (
    <div>
      <h2>About</h2>
      <p>This is a movie search app.</p>
    </div>
  );
}

const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "d60ecb78";
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;


function App() {
  const [movies, setMovies] = useState([])
  const [serachTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  

  const searchMovies = async (title) => {
    setLoading(true);
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();
    setMovies(data.Search);
    setLoading(false);
   
    // Add to recent searches if not already present
    if (title && !recentSearches.includes(title)) {
      setRecentSearches(prev => [title, ...prev.slice(0, 4)]); // Keep only 5 recent searches
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMovies(serachTerm);
    } else if (e.key === 'Escape') {
      setSearchTerm("");
      setMovies([]);
    }
  };

  const handleSearchClick = () => {
    searchMovies(serachTerm);
  };

  const handleClearClick = () => {
    setSearchTerm("");
    setMovies([]);
  };

  
  useEffect(() => {
    searchMovies("Batman");
  }, []);


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
                value={serachTerm}
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
            {loading && <div className="loader">Loading...</div>}
            {movies?.length > 0 ? (
              <div className="container">
                {movies.map((movie) => (
                  <MovieCard movie={movie} key={movie.imdbID} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <h2>error 404</h2>
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
