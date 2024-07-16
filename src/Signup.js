import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpwd, setConfirmpwd] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert('Mobile number should be exactly 10 digits!');
      return;
    }
    if (password !== confirmpwd) {
      alert('Passwords do not match.');
      return;
    }
    try {
      const response = await fetch('https://movie-ticket-booking-mern-backend-rizjldro8.vercel.app/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, mobile }),
      });
      const data = await response.json();
      if(data.status == 'ok'){
        alert("signup successfull !");
        navigate('/signin');
      }else{
        alert('error occured while signup !');
        return;
      }
    } catch (error) {
      alert('An error occurred! Please try again.');
    }
  }

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required />
        <input type="number" name="mobile" id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Your Mobile" required />
        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <input type="password" name="confirmpwd" id="confirmpwd" value={confirmpwd} onChange={(e) => setConfirmpwd(e.target.value)} placeholder="Confirm password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p><Link to='/signin' className="signup-title">Sign in here</Link></p>
    </div>
  );
}

export default Signup;
