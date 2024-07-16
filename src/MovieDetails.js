import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/MovieDetails.css';
import { Link } from 'react-router-dom';

function MovieDetails() {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      console.log(`Fetching movie details for id: ${id}`);
      try {
        const response = await axios.get('https://movie-ticket-booking-mern-backend-rizjldro8.vercel.app/moviess/${id}`);
        console.log('Response data:', response.data);
        if (response.data.movie) {
          setMovieDetails(response.data.movie);
        } else {
          setError('No movie details found.');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!movieDetails) {
    return <div>No movie details found.</div>;
  }

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const theaters = movieDetails.theaters.split(',');

  const handletime = async (showtime, theater) => {
    const date = new Date().toISOString().split('T')[0];
    try {
      const encodedTheater = encodeURIComponent(theater.trim());
      const encodedDate = encodeURIComponent(date.trim());
      const response = await axios.get(`https://movie-ticket-booking-mern-backend-rizjldro8.vercel.app/movies/${id}/${encodedTheater}/${showtime}/${encodedDate}`);
      const data = response.data.seatingData;
      localStorage.setItem('seatings', JSON.stringify(data));
      window.location.reload();
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };
  

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const isPastShowtime = (showtime) => {
    if (showtime < currentHour) {
      return true;
    } else if (showtime === currentHour && currentMinutes >= 0) {
      return true;
    }
    return false;
  };

  return (
    <div className="movie-details">
      <h1>Movie Details</h1>
      <div className="movie-summary">
        <img src={movieDetails.posterUrl} alt={movieDetails.title} className="movie-poster" />
        <div className="movie-info">
          <p className="content-styles1"><strong>Title:</strong> {movieDetails.title}</p>
          <p className="content-styles"><strong>Duration:</strong> {movieDetails.duration} minutes</p>
          <p className="content-styles"><strong>City:</strong> {movieDetails.city}</p>
          <p className="content-styles"><strong>Description:</strong> {movieDetails.description}</p>
          <p className="content-styles"><strong>Release Date:</strong> {formatDate(movieDetails.releaseDate)}</p>
          <div className="theaters">
          {theaters.map((theater, index) => (
        <div key={index} className="theater">
          <div className="theater-name">{theater.trim()} Theatre</div>
          <div className="showtimes-container">
            {[11, 14, 18, 21].map((showtime, idx) => {
              if (!isPastShowtime(showtime)) {
                return (
                  <Link key={idx} to={`/movies/${id}/seating`} style={{ textDecoration: 'none' }}>
                    <div className="showtime-box" onClick={() => handletime(showtime, theater)}>
                      <div className="showtime">{showtime <= 12 ? showtime : showtime - 12}:00 {showtime < 12 || showtime === 24 ? 'AM' : 'PM'}</div>
                    </div>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
        </div>


        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
