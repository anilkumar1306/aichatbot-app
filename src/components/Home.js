import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './styles.css';

function Home() {
  const [name, setName] = useState('');
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [busType, setBusType] = useState('');
  const [seats, setSeats] = useState(0);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/", {
        name, 
        sourceLocation, 
        destinationLocation, 
        travelDate, 
        busType, 
        seats
      });
      
      if (res.data === "notexist") {
        alert("The name already exists in the database. Please choose a different name.");
      } else {
        alert("Successfully booked the bus tickets!");
      }
    } catch (error) {
      alert("An error occurred. Please check your details and try again.");
      console.log(error);
    }
  }

  const bookWithAI = () => {
    navigate('/signup');
  };

  return (
    <div>
      <header>
        <div className="container">
          <h1>TSRTC Ticket Booking</h1>
          <nav>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="download">Download Tickets</a></li>
              <li><a href="#">Schedules</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div className="container">
          <section className="booking-form">
            <h2>Book Your Ticket</h2>
            <form id="ticketForm" onSubmit={submit}>
              <label htmlFor="name">Name:</label>
              <input type="text" onChange={(e) => setName(e.target.value)} id="name" name="name" required />

              <label htmlFor="from">From:</label>
              <input type="text" onChange={(e) => setSourceLocation(e.target.value)} id="from" name="from" required />

              <label htmlFor="to">To:</label>
              <input type="text" onChange={(e) => setDestinationLocation(e.target.value)} id="to" name="to" required />

              <label htmlFor="date">Date of Journey:</label>
              <input type="date" onChange={(e) => setTravelDate(e.target.value)} id="date" name="date" required />

              <label htmlFor="busType">Bus Type:</label>
              <input type="text" onChange={(e) => setBusType(e.target.value)} id="busType" name="busType" required />

              <label htmlFor="passengers">Number of Passengers:</label>
              <input type="number" onChange={(e) => setSeats(e.target.value)} id="passengers" name="passengers" required min="1" />

              <div className="button-container">
                <button type="submit" style={{width: '10%'}}>Book Now</button>
                <button type="button" onClick={bookWithAI}>Book with AI</button>
              </div>
            </form>
          </section>

          <section className="info">
            <h2>Travel with Comfort</h2>
            <p>TSRTC provides comfortable and affordable travel services across Telangana and beyond. Book your tickets easily using our online portal and enjoy a hassle-free journey.</p>
          </section>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>&copy; 2024 TSRTC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
