import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Navbar({ isLoggedIn, handleLogout }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    fetchLocations();
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      setSelectedLocation(storedCity);
    }
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('https://movie-ticket-booking-mern-backend-rizjldro8.vercel.app/cities');
      setLocations(response.data.cities);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedLocation(selectedCity);
    localStorage.setItem('selectedCity', selectedCity);
    window.location.reload();
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  let navContent;
  if (isLoggedIn) {
    navContent = (
      <>
        <li className="navbar__item">
          <button onClick={toggleDropdown} className="navbar__button">Profile</button>
          {isDropdownVisible && (
            <ul className="navbar__dropdown">
              <li><Link to='/profile' className="navbar__dropdown-link">Profile</Link></li>
              <li><Link to='/bookings' className="navbar__dropdown-link">My Bookings</Link></li>
              <li><button onClick={handleLogout} className="navbar__dropdown-button">Logout</button></li>
            </ul>
          )}
        </li>
      </>
    );
  } else {
    navContent = (
      <li><Link to='/signin' className="navbar__link">Sign In</Link></li>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar__title">Movie Ticket Booking</div>
      <ul className="navbar__links">
      <li>
          <select value={selectedLocation} onChange={handleLocationChange} className="navbar__select">
            <option value="">Select a city</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </li>
        <li><Link to='/movies' className="navbar__link">Movies</Link></li>
        {navContent}
      </ul>
    </nav>
  );
}

export default Navbar;
