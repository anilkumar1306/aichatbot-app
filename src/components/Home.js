import React from 'react';
import './styles.css'; // assuming you have your CSS file in the same directory

function Home() {
  const bookWithAI = () => {
    // Define functionality for booking with AI
  };

  return (
    <div>
      <header>
        <div className="container">
          <h1>TSRTC Ticket Booking</h1>
          <nav>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Book Tickets</a></li>
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
            <form id="ticketForm">
              <label htmlFor="from">From:</label>
              <input type="text" id="from" name="from" required />

              <label htmlFor="to">To:</label>
              <input type="text" id="to" name="to" required />

              <label htmlFor="date">Date of Journey:</label>
              <input type="date" id="date" name="date" required />

              <label htmlFor="passengers">Number of Passengers:</label>
              <input type="number" id="passengers" name="passengers" required min="1" />

              <div className="button-container">
                <button type="submit">Book Now</button>
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
