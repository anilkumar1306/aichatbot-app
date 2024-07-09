import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState(''); // Track the stage of conversation
  const [name, setName] = useState('');
  const [sourceLocation, setSourceLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [busType, setBusType] = useState('');
  const [seats, setSeats] = useState(0);
  const [optionValue, setOptionValue] = useState(''); // Track whether the user picked booking or cancellation
  const [totalPrice, setTotalPrice] = useState(0); // Track total price
  const [publicAddress, setPublicAddress] = useState('');
  const [privateAddress, setPrivateAddress] = useState('');

  const locations = [
    'Shamshabad', 'Patancheru', 'LB Nagar', 'Aloor', 'Choutuppal', 'Narsampet',
    'Peddapalli', 'Armoor', 'Sathupalli', 'Balkonda', 'Medchal', 'Chennur', 'Luxettipet'
  ];

  const busTypes = [
    'AC', 'Non-AC', 'Sleeper AC', 'Sleeper Non-AC'
  ];

  const prices = {
    'AC': 0.0018,
    'Non-AC': 0.0014,
    'Sleeper AC': 0.0026,
    'Sleeper Non-AC': 0.0022
  };

  useEffect(() => {
    // Greet the user when the component mounts
    greetUser();
  }, []);

  const greetUser = () => {
    const greeting = "Hello, Welcome to our Website. Please enter your name.";
    setMessages([{ sender: 'bot', text: greeting }]);
    setStage('greeted');
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      const currentInput = input;
      setInput('');
      generateResponse(currentInput);
    }
  };

  const generateResponse = (userInput) => {
    let botResponse = '';
    if (stage === 'greeted') {
      // After greeting, ask how to assist
      setName(userInput);
      botResponse = `Nice to meet you, ${userInput}. How can I assist you today?`;
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      setStage('options');
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'Please choose an option:' },
          {
            sender: 'bot',
            text: '',
            options: [
              { label: 'Booking', value: 'booking' },
              { label: 'Cancellation', value: 'cancellation' }
            ]
          }
        ]);
      }, 1000);
    } else if (stage === 'selectingSource') {
      setSourceLocation(userInput);
      botResponse = 'Please select your destination location.';
      const filteredLocations = locations.filter(location => location !== userInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botResponse },
        {
          sender: 'bot',
          text: '',
          options: filteredLocations.map(location => ({ label: location, value: location }))
        }
      ]);
      setStage('selectingDestination');
    } else if (stage === 'selectingDestination') {
      setDestinationLocation(userInput);
      botResponse = 'Please enter your travel date (dd/mm/yyyy).';
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      setStage('enteringDate');
    } else if (stage === 'enteringDate') {
      if (validateDate(userInput)) {
        setTravelDate(userInput);
        botResponse = `Your travel date is set to ${userInput}. Please select your bus type/class (e.g., AC, Non-AC, Sleeper AC, Sleeper Non-AC).`;
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'bot',
            text: '',
            options: busTypes.map(type => ({ label: type, value: type }))
          }
        ]);
        setStage('selectingBusType');
      } else {
        botResponse = 'Please enter a valid date (dd/mm/yyyy).';
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      }
    } else if (stage === 'selectingBusType') {
      setBusType(userInput);
      botResponse = `You have selected ${userInput} class. Please enter how many seats you want to book.`;
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      setStage('enteringSeats');
    } else if (stage === 'enteringSeats') {
      const seats = parseInt(userInput, 10);
      if (Number.isInteger(seats) && seats > 0) {
        setSeats(seats);
        const pricePerSeat = prices[busType];
        const totalPrice = pricePerSeat * seats;
        setTotalPrice(totalPrice);
        botResponse = `The total price for ${seats} seats in ${busType} class is ${totalPrice} Ethereum Sepolia. Please enter your public address.`;
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
        setStage('enteringPublicAddress');
      } else {
        botResponse = 'Please enter a valid number of seats.';
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      }
    } else if (stage === 'enteringPublicAddress') {
      setPublicAddress(userInput);
      botResponse = 'Please enter your private address.';
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      setStage('enteringPrivateAddress');
    } else if (stage === 'enteringPrivateAddress') {
      setPrivateAddress(userInput);
      if (optionValue === 'Booking') {
        botResponse = `Thanks for providing the details. Your booking has been confirmed. You have booked ${seats} seats in ${busType} class from ${sourceLocation} to ${destinationLocation} on ${travelDate}. The total price is ${totalPrice} Ethereum Sepolia.`;
      } else if (optionValue === 'Cancellation') {
        botResponse = `You have requested to cancel your booking.`;
      }
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      setStage('completed');
      submit();
    } else if (stage === 'cancellationConfirmation') {
      if (userInput.toLowerCase() === 'yes') {
        botResponse = 'Your booking has been cancelled.';
        setOptionValue('Cancellation');
        submit();
      } else {
        botResponse = 'Cancellation aborted.';
      }
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
      setStage('completed');
    } else {
      botResponse = `You said: ${userInput}`;
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }]);
    }
  };

  const handleOptionClick = (optionValue) => {
    if (stage === 'options') {
      setMessages([...messages, { sender: 'user', text: optionValue }]);
      if (optionValue === 'booking') {
        setMessages([
          ...messages,
          { sender: 'bot', text: 'You clicked on Booking! Please select a valid source location:' },
          {
            sender: 'bot',
            text: '',
            options: locations.map(location => ({ label: location, value: location }))
          }
        ]);
        setStage('selectingSource');
        setOptionValue('Booking');
      } else if (optionValue === 'cancellation') {
        setMessages([
          ...messages,
          { sender: 'bot', text: 'Are you sure you want to cancel the booking?' },
          {
            sender: 'bot',
            text: '',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]
          }
        ]);
        setStage('cancellationConfirmation');
        setOptionValue('Cancellation');
      }
    } else if (stage === 'selectingSource') {
      generateResponse(optionValue);
    } else if (stage === 'selectingDestination') {
      generateResponse(optionValue);
    } else if (stage === 'selectingBusType') {
      generateResponse(optionValue);
    } else if (stage === 'cancellationConfirmation') {
      generateResponse(optionValue);
    }
  };

  const validateDate = (dateStr) => {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!datePattern.test(dateStr)) {
      return false;
    }
    const [day, month, year] = dateStr.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
    return inputDate >= currentDate;
  };

  async function submit() {
    try {
      if (optionValue === 'Booking') {
        await axios.post("http://localhost:8000/chatbot", {
          name,
          sourceLocation,
          destinationLocation,
          travelDate,
          busType,
          seats,
          totalPrice,
          publicAddress,
          privateAddress,
          optionValue,
        });
        alert("Successfully booked the bus tickets!");
      } else if (optionValue === 'Cancellation') {
        await axios.post("http://localhost:8000/chatbot", {
          name,
          optionValue,
        });
        alert("Successfully cancelled the bus tickets!");
      } else {
        alert("An error occurred. Please check your details and try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("An error occurred. Please check your details and try again.");
    }
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
            {message.options && (
              <div className="options">
                {message.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          style={{ width: '92%' }}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default App;
