import React from 'react';
import './styles/Seating.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Seating({ seatingDataString }) {
  const navigate = useNavigate();
  const seatingData = JSON.parse(seatingDataString);
  let showtime = '';
  if(seatingData.showTiming === '11'){
    showtime = "11:00 AM"
  }else if(seatingData.showTiming === '14'){
    showtime = "2:00 PM"
  }else if(seatingData.showTiming === '18'){
    showtime = "6:00 PM"
  }else if(seatingData.showTiming === '21'){
    showtime = "9:00 PM"
  }

  const date = new Date(seatingData.date);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;

  const seats = seatingData && Array.isArray(seatingData.seats) ? seatingData.seats : [];

  const rows = [];
  for (let i = 0; i < seats.length; i += 20) {
    rows.push(seats.slice(i, i + 20));
  }


  const handleSeatClick = async (seatNumber) => {
    const isloggedin = localStorage.getItem('isloggedin');
    if (isloggedin) {
      const user = localStorage.getItem('userdata');
      const userdata = JSON.parse(user);
      const email = userdata.email;
  
      try {
        const response = await axios.post('https://movie-ticket-booking-mern-backend-d4l9-4n3hfsha6.vercel.app/movies/seating/booking', {
            seatNumber: seatNumber,
            movieName: seatingData.movieName,
            showtime: showtime,
            email: email,
            formattedDate: formattedDate,
            theaterName: seatingData.theaterName
        });
        if (response.data.bookingstatus === "success") {
           alert(`🎉 Congratulations! You've successfully booked Seat ${seatNumber} for the ${showtime} show of ${seatingData.movieName}! Enjoy the movie experience! 🍿🎬`);
            navigate('/movies');
            window.location.reload();
        } else if (response.data.bookingstatus === "already booked") {
            alert("This seat is already booked. Please choose another seat.");
        } else {
            alert("Error while booking! Please try again later.");
        }
    } catch (error) {
        console.log("Error: ", error);
        alert("Error while booking! Please try again later.");
    }
    
    } else {
      alert("Please log in to book your ticket!");
    }
  };
  

  return (
    <div className="seating">
      <div className='instructions'>
        <button className='available_inst'><p>available</p></button>
        <button className='booked_inst'><p>booked</p></button>
      </div>

      <div className='Movie-name'><p>{seatingData.movieName} - {showtime}  - {formattedDate} - {seatingData.theaterName} - {seatingData.theateraddress}</p></div>
      <div className="ticket-cost">Cost of each ticket:<strong> Rs150</strong></div>
      <div className="seat-buttons">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((seat, index) => (
              <button
                key={index}
                onClick={() => handleSeatClick(seat.seatNumber)}
                className={seat.isBooked ? 'booked' : 'available'}
              >
                {seat.seatNumber}
              </button>
            ))}
            {(rowIndex + 1) % 2 === 0 && <br />}
          </div>
        ))}
      </div>
      <div className='screen'><strong>--------------------------------- Screen This way -----------------------------</strong></div>
    </div>
  );
}

export default Seating;
