const express = require("express");
const collection = require("./mongo");
const bookingend = require("./bookingend");
const mongoose = require('mongoose');
// Ensure this is the correct model name
const cors = require("cors");
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await collection.findOne({ email, password });

    if (check) {
      res.json("exist");
    } else {
      res.json("not exist");
    }
  } catch (e) {
    res.json("not exist");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  const data = {
    username,
    email,
    password,
  };

  try {
    const check = await collection.findOne({ email });

    if (check) {
      res.json("exist");
    } else {
      await collection.insertMany([data]);
      res.json("not exist");
    }
  } catch (e) {
    res.json("not exist");
  }
});

app.post("/", async (req, res) => {
  const { name, sourceLocation, destinationLocation, travelDate, busType, seats, totalPrice, transactionHash, publicAddress, privateAddress } = req.body;

  const newData = {
    name,
    sourceLocation,
    destinationLocation,
    travelDate,
    busType,
    seats,
    totalPrice,
    transactionHash,
    publicAddress,
    privateAddress
  };

  try {
    const check = await bookingend.findOne({ name });

    if (check) {
      res.json("exist");
    } else {
      await bookingend.create(newData);
      res.json("not exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("error");
  }
});

app.post('/chatbot', async (req, res) => {
  const { name, sourceLocation, destinationLocation, travelDate, busType, seats, totalPrice, transactionHash, publicAddress, privateAddress, optionValue } = req.body;

  const data = { name, sourceLocation, destinationLocation, travelDate, busType, seats, totalPrice, transactionHash, publicAddress, privateAddress };

  try {
    if (optionValue === 'Booking') {
      await bookingend.insertMany([data]);
      res.json({ message: "Booking successful" });
    } else {
      res.status(400).json({ message: "Invalid optionValue" });
    }
  } catch (e) {
    console.error('Error processing request:', e.message); // Log error message
    console.error('Full error details:', e); // Log full error details
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/chatbot', async (req, res) => {
  try {
    const { name } = req.query; // Destructure `name` from query parameters
    console.log('Fetching user details for name:', name);

    const userData = await bookingend.findOne({ name });

    if (userData) {
      const { name, totalPrice, publicAddress } = userData;
      res.json({ name, totalPrice, publicAddress });
    } else {
      res.status(404).json({ message: 'Name not found' });
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.post('/cancel', async (req, res) => {
  const { name } = req.body;

  try {
    const userData = await bookingend.deleteMany({ name });
    res.json(userData);
  } catch (e) {
    console.error('Error cancelling booking:', e);
    res.status(500).json({ message: 'Server Error' });
  }
});


app.get('/download', async (req, res) => {
  try {
    const name = req.query.name;
    const userData = await bookingend.findOne({ name });

    if (userData) {
      const { name, sourceLocation, destinationLocation, travelDate, busType, seats, totalPrice, transactionHash, publicAddress, privateAddress } = userData;
      res.json({ name, sourceLocation, destinationLocation, travelDate, busType, seats, totalPrice, transactionHash, publicAddress, privateAddress });
    } else {
      res.status(404).json({ message: 'name not found' });
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(8000, () => {
  console.log("port is connected");
});
