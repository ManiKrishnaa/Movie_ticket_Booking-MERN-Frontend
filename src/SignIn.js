import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SignIn({handleLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('https://movie-ticket-booking-mern-backend-d4l9-4n3hfsha6.vercel.app/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (data.status == 'ok') {
                localStorage.setItem('isloggedin',true);
                localStorage.setItem('userdata',JSON.stringify(data.userdata));
                handleLogin();
                navigate('/movies');
            } else if(data.status == 'nouser') {
                alert('no user found ! please signup first !');
                return;
            } else if(data.status == 'invalid_credintials'){
                alert('Invalid Credintials !');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred, please try again later');
        }
    };


    return (
        <div className="signin">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" required />
                </div>
                <div className="form-group">
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your Password" required />
                </div>
                <button type="submit">Sign In</button>
            </form>
            <p><Link to='/signup' className="signin-title">Sign up here</Link></p>
        </div>
    );
}

export default SignIn;
