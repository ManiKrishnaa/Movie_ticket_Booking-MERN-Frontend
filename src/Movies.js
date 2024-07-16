import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styles/Movies.css';

function Movies({ selectedcity }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`https://movie-ticket-booking-mern-backend-d16m28nn2.vercel.app/movies/${selectedcity}`);
        setMovies(response.data.movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [selectedcity]);

  const handleMovieClick = (movieId) => {
    localStorage.setItem('selectedMovieId', movieId); 
  };

  return (
    <div className="movie-container">
      <h1>Available movies in {selectedcity}</h1>
      <div className="movie-cards">
        {movies.map(movie => (
          <Link to={`/movies/${movie._id}`} key={movie._id} className="movie-card" onClick={() => handleMovieClick(movie._id)} >
            <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
            <div className="movie-details">
              <h2>{movie.title}</h2>
              <p><strong>Runtime:</strong> {movie.duration} minutes</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Movies;
