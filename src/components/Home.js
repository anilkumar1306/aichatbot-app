import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import './styles.css';

const governmentAddress = '0x66d72892eC09Dd980e0589910fB9E6C0F79F0B43';

function Home() {
  const [name, setName] = useState('');
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [busType, setBusType] = useState('');
  const [seats, setSeats] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [publicAddress, setPublicAddress] = useState('');
  const [privateAddress, setPrivateAddress] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const navigate = useNavigate();

  const calculateTotalPrice = () => {
    let pricePerSeat = 0;
    switch (busType) {
      case 'AC':
        pricePerSeat = 0.0018;
        break;
      case 'Non-AC':
        pricePerSeat = 0.0014;
        break;
      case 'Sleeper AC':
        pricePerSeat = 0.0026;
        break;
      case 'Sleeper Non-AC':
        pricePerSeat = 0.0022;
        break;
      default:
        pricePerSeat = 0;
    }
    return pricePerSeat * seats;
  };

  const submit = async (e) => {
    e.preventDefault();

    const calculatedPrice = calculateTotalPrice();
    try {
      // Perform the transaction
      const transactionHash = await processTransaction(privateAddress, calculatedPrice);

      // If transaction is successful, save booking details to the database
      const res = await axios.post("http://localhost:8000/", {
        name,
        sourceLocation,
        destinationLocation,
        travelDate,
        busType,
        seats,
        totalPrice: calculatedPrice,
        publicAddress,
        privateAddress,
        transactionHash
      });

      if (res.data === "exist") {
        alert("The name already exists in the database. Please choose a different name.");
      } else {
        alert("Successfully booked the bus tickets!");
        setTransactionHash(transactionHash); // Update the state with the transaction hash
      }
    } catch (error) {
      alert("An error occurred. Please check your details and try again.");
      console.log(error);
    }
  };

  const processTransaction = async (privateKey, amount) => {
    try {
      const provider = new ethers.providers.InfuraProvider('sepolia', '427b470c4a084e9f857e777d1261a9dd'); // Your Infura project ID
      const wallet = new ethers.Wallet(privateKey, provider);
      const transaction = await wallet.sendTransaction({
        to: governmentAddress,
        value: ethers.utils.parseEther(amount.toString())
      });
      await transaction.wait(); // Wait for the transaction to be mined
      return transaction.hash; // Return the transaction hash
    } catch (error) {
      console.error("Transaction failed:", error);
      throw new Error("Transaction failed");
    }
  };

  const bookWithAI = () => {
    navigate('/signup');
  };

  useEffect(() => {
    const calculatedPrice = calculateTotalPrice();
    setTotalPrice(calculatedPrice);
  }, [busType, seats]);

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
              <select id="busType" onChange={(e) => setBusType(e.target.value)} value={busType} required>
                <option value="">Select Bus Type</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
                <option value="Sleeper AC">Sleeper AC</option>
                <option value="Sleeper Non-AC">Sleeper Non-AC</option>
              </select>

              <label htmlFor="passengers">Number of Passengers:</label>
              <input type="number" onChange={(e) => setSeats(e.target.value)} id="passengers" name="passengers" required min="1" />

              {totalPrice > 0 && (
                <p>Total Price: {totalPrice.toFixed(4)} Sepolia</p>
              )}

              <label htmlFor="publicAddress">Please enter your public address:</label>
              <input type="text" onChange={(e) => setPublicAddress(e.target.value)} id="publicAddress" name="publicAddress" required />

              <label htmlFor="privateAddress">Please enter your private address:</label>
              <input type="text" onChange={(e) => setPrivateAddress(e.target.value)} id="privateAddress" name="privateAddress" required />

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
