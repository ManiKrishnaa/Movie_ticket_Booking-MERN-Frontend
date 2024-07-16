import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './styles/Navbar.css';
import './styles/Footer.css';
import './styles/Signup.css';
import './styles/Signin.css';
import Movies from './Movies';
import SignIn from './SignIn';
import Signup from './Signup';
import MovieDetails from './MovieDetails';
import Seating from './Seating';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('userdata');
    localStorage.removeItem("isloggedin");
    localStorage.setItem('isLoggedIn', 'false');
  };

  const storedCity = localStorage.getItem('selectedCity');
  const seatingDataString = localStorage.getItem('seatings');

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Movies selectedcity={storedCity} />} />
          <Route path="/movies" element={<Movies selectedcity={storedCity} />} />
          <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies/:id/seating" element={<Seating seatingDataString={seatingDataString}   />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;