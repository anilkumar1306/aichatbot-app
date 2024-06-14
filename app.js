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

app.post("/chatbot", async (req, res) => {
  const { name, sourceLocation, destinationLocation, dateTime, busType, seatNumber, issue } = req.body;

  const data = {
    name,
    sourceLocation,
    destinationLocation,
    dateTime,
    busType,
    seatNumber,
  };

  try {
    if (issue === "Booking") {
      const check = await bookingend.findOne({ name });

      if (check) {
        res.json("exist");
      } else {
        await bookingend.insertMany([data]);
        res.json("not exist");
      }
    } else if (issue === "Cancellation") {
      const result = await bookingend.deleteOne({ name });

      if (result.deletedCount > 0) {
        res.json("cancelled");
      } else {
        res.json("not exist");
      }
    } else {
      res.status(400).json("Invalid issue type");
    }
  } catch (e) {
    res.json("not exist");
  }
});

app.listen(8000, () => {
  console.log("port is connected");
});
